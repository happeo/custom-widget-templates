import React, { useEffect, useState, useRef } from "react";
import { ButtonSecondary, IconButton } from "@happeouikit/buttons";
import { Tooltip } from "@happeouikit/tooltip";
import { Input, LinkExternal } from "@happeouikit/form-elements";
import { IconSearch, IconClose } from "@happeouikit/icons";
import styled from "styled-components";
import { BodyUI } from "@happeouikit/typography";
import { suggestIssues } from "../actions";
import { Loader } from "@happeouikit/loaders";
import { radius300, shadow300 } from "@happeouikit/theme";
import { margin200, padding200, padding300 } from "@happeouikit/layout";
import { warn, active, lighten, alert, gray05 } from "@happeouikit/colors";
import { toSafeText } from "../utils";
import useDebounce from "../useDebounce";

const IssueSearch = ({ widgetApi, rootUrl }) => {
  const autocompleteContainer = useRef();
  const [inFocus, setInFocus] = useState(false);
  const [preQuery, setQuery] = useState("");
  const query = useDebounce(preQuery, 300);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [error, setError] = useState(false);
  const [showList, setShowList] = useState(false);
  const blurTimeout = useRef();

  useEffect(() => {
    const doQuery = async () => {
      try {
        setError(false);
        setLoading(true);
        setSelectedIndex(-1);
        const token = await widgetApi.getJWT();

        const { items = [] } = await suggestIssues(token, {
          query,
        });
        setIssues(items);
        setShowList(true);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError(error);
      }
    };

    if (query.length > 1) {
      doQuery();
    }
  }, [query]);

  useEffect(() => {
    const el = autocompleteContainer.current;
    if (!el) {
      return;
    }

    const inputEl = el.querySelector("INPUT");
    if (!inputEl) {
      return;
    }

    function handleDir(event) {
      const key = event.key;

      if (key === "Enter") {
        const selectedLink = el.querySelector(".selected a");
        if (selectedLink) {
          window.open(selectedLink.href, "_blank");
        } else {
          window.open(
            `${rootUrl}/issues/?jql=text%20~%20"${query}*"%20OR%20summary%20~%20"${query}*"`,
            "_blank",
          );
        }
      }

      const dirNo =
        key === "ArrowUp" ? -1 : key === "ArrowDown" || key === "Tab" ? 1 : 0;

      setSelectedIndex((prevValue) => {
        const newVal = Math.max(-1, prevValue + dirNo);

        if (key === "Tab" && newVal !== issues.length) {
          event.preventDefault();
        }

        const minVal = Math.min(newVal, issues.length - 1);

        return minVal;
      });
    }

    function handleFocus() {
      setShowList(true);
      inputEl.addEventListener("keydown", handleDir);
    }

    function handleClick(event) {
      clearTimeout(blurTimeout.current);
      if (!el.contains(event.target)) {
        setShowList(false);
        blurTimeout.current = setTimeout(() => {
          if (query.length > 0 || inputEl.activeElement) {
            console.log("input active");
            return;
          }
          setInFocus(false);
        }, 5000);
        return;
      }
      if (event.target === inputEl) {
        return;
      }
      inputEl.removeEventListener("keydown", handleDir);
    }

    inputEl.addEventListener("keydown", handleDir);
    inputEl.addEventListener("focus", handleFocus);
    document.addEventListener("click", handleClick);
    return () => {
      inputEl.removeEventListener("keydown", handleDir);
      inputEl.removeEventListener("focus", handleFocus);
      document.removeEventListener("click", handleClick);
      clearTimeout(blurTimeout.current);
    };
  }, [query, issues]);

  const search = (e) => {
    setQuery(e.target.value);
    if (e.target.value === "") {
      setIssues([]);
    }
  };

  return (
    <>
      <AutocompleteContainer
        ref={autocompleteContainer}
        style={{ display: inFocus ? "block" : "none" }}
      >
        <Input
          icon={IconSearch}
          placeholder="Search"
          onChange={search}
          value={preQuery}
          autoFocus
          style={{ paddingRight: "36px" }}
        />
        {query.length > 0 && (
          <StyledIconButton
            icon={IconClose}
            onClick={() => search({ target: { value: "" } })}
            aria-label="Clear search"
          />
        )}

        {showList && (
          <AutocompleteList className="autocomplete-list">
            {issues.map((item, index) => (
              <AutocompleteItem
                key={item.id}
                isSelected={index === selectedIndex}
                className={index === selectedIndex ? "selected" : ""}
              >
                <LinkExternal href={item.url}>
                  {item.icon && <IssueImage src={item.icon} />}
                  <div>
                    {item.subtitle && (
                      <BodyUI
                        style={{
                          color: gray05,
                          marginRight: margin200,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.subtitle}
                      </BodyUI>
                    )}
                    <BodyUI
                      dangerouslySetInnerHTML={{
                        __html: toSafeText(item.highlightedText),
                      }}
                    ></BodyUI>
                  </div>
                </LinkExternal>
              </AutocompleteItem>
            ))}
            {!loading && query.length > 0 && (
              <OpenInJira>
                <LinkExternal
                  href={`${rootUrl}/issues/?jql=text%20~%20"${query}*"%20OR%20summary%20~%20"${query}*"`}
                >
                  <BodyUI>{`Search "${query}" in Jira`}</BodyUI>
                </LinkExternal>
              </OpenInJira>
            )}
            {loading && <Loader containerHeight="40px" />}
            {error && (
              <BodyUI style={{ color: alert, padding: padding200 }}>
                Unable to search
              </BodyUI>
            )}
          </AutocompleteList>
        )}
      </AutocompleteContainer>

      {!inFocus && (
        <>
          <IconButton
            data-for="expand-search"
            data-tip="Search from Jira"
            aria-label="Search from Jira"
            icon={IconSearch}
            onClick={() => {
              setInFocus(true);
            }}
          />
          <Tooltip id="expand-search" />
        </>
      )}
    </>
  );
};

const AutocompleteContainer = styled.div`
  position: relative;
  width: 280px;
  max-width: 100%;
`;
const StyledIconButton = styled(IconButton)`
  position: absolute;
  right: 1px;
  top: 1px;
  bottom: 1px;
  z-index: 1;
`;
const AutocompleteList = styled.ul`
  position: absolute;
  background-color: #fff;
  width: 100%;
  border-radius: 0 0 ${radius300} ${radius300};
  z-index: 1;
  box-shadow: ${shadow300};
`;
const AutocompleteItem = styled.li`
  padding: ${padding200};
  ${({ isSelected }) =>
    isSelected
      ? `
    background-color: ${lighten(active, 0.9)};
  `
      : ``}
  a {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
  }
  p b {
    font-weight: normal;
    background-color: ${warn};
  }
`;
const IssueImage = styled.img`
  width: 24px;
  height: 24px;
  margin-right: ${margin200};
`;
const OpenInJira = styled.div`
  padding: ${padding300};
  text-align: center;
`;
export default IssueSearch;
