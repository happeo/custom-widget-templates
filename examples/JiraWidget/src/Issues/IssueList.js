import React, { useState, useEffect } from "react";

import { ListStripedContainer, ListHeader } from "@happeouikit/list";
import { Loader } from "@happeouikit/loaders";
import { TextEpsilon } from "@happeouikit/typography";
import { ButtonSecondary } from "@happeouikit/buttons";
import { radius500 } from "@happeouikit/theme";
import { IconExternalLink } from "@happeouikit/icons";

import { searchIssues } from "../actions";
import LoadingIssues from "./LoadingIssues";
import Issue from "./Issue";
import {
  AVAILABLE_COLUMNS,
  DEFAULT_COLUMNS,
  ORDER_BY_REGEX,
  SETTINGS_KEYS,
} from "../constants";
import ColumnsFilter from "./ColumnsFilter";
import { ErrorMessage } from "../StateMessages";
import { margin300, padding300, Spacer } from "@happeouikit/layout";
import { white } from "@happeouikit/colors";
import IssueSearch from "./IssueSearch";

const IssueList = ({ widgetApi, settings, query, setUnauthorized }) => {
  const [loading, setLoading] = useState(true);
  const [onLoadingSort, setOnLoadingSort] = useState(false);
  const [error, setError] = useState();
  const [issues, setIssues] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [sortDir, setSortDir] = useState("asc");
  const [sortField, setSortField] = useState("");
  const [rootUrl, setRootUrl] = useState();
  const [selectedColumns, setSelectedColumns] = useState(
    settings.selectedColumns && settings.selectedColumns !== ""
      ? JSON.parse(settings.selectedColumns)
      : DEFAULT_COLUMNS,
  );

  useEffect(() => {
    let mounted = true;
    const get = async () => {
      setError(false);
      setLoading(true);
      try {
        const match = settings.jql
          ? ORDER_BY_REGEX.exec(settings.jql.toLowerCase())
          : "";
        if (match?.length === 3) {
          setSortField(match[1]);
          setSortDir(match[2]);
        }

        const jql = query ? `text ~ "${query}"` : settings.jql || "";
        const maxResults = settings.maxResults || 10;
        const startAt = pageNumber * maxResults;
        const token = await widgetApi.getJWT();
        const result = await searchIssues(token, {
          jql,
          maxResults,
          startAt,
        });

        if (mounted) {
          setIssues((prevValue) => [
            ...new Map(
              [...(pageNumber > 0 ? prevValue : []), ...result.items].map(
                (item) => [item.id, item],
              ),
            ).values(),
          ]);
          setRootUrl(result._project.projectBaseUrl);
          setTotal(result.total);
          setHasMore(result.items.length >= maxResults);
          setLoading(false);
        }
      } catch (error) {
        if (mounted) {
          if (error.message === "unauthorized") {
            setUnauthorized(true);
          } else {
            widgetApi.reportError(error.message);
            setError(error);
            setLoading(false);
          }
        }
      }
    };

    if (widgetApi) get();
    return () => {
      mounted = false;
    };
  }, [widgetApi, settings, pageNumber]);

  useEffect(() => {
    if (issues.length <= 1) {
      return;
    }

    let mounted = true;

    const applySort = async () => {
      setOnLoadingSort(true);
      let jql = settings.jql || "";

      const match = ORDER_BY_REGEX.exec(jql.toLowerCase());
      if (match?.length === 3) {
        jql = jql.replace(ORDER_BY_REGEX, "");
      }
      jql = `${jql} order by ${sortField}${" " + sortDir.toUpperCase()}`;
      const maxResults = (settings.maxResults || 10) * (pageNumber + 1);
      const token = await widgetApi.getJWT();
      const result = await searchIssues(token, {
        jql: jql.trim(),
        maxResults,
        startAt: 0,
      });
      if (result.errorMessage) {
        setOnLoadingSort(false);
        return;
      }
      if (mounted) {
        setIssues(result.issues);
        setTotal(result.total);
        setHasMore(result.issues.length >= maxResults);
        setOnLoadingSort(false);
      }
    };

    applySort();

    return () => {
      mounted = false;
    };
  }, [sortDir, sortField]);

  const loadMore = () => setPageNumber((prevValue) => prevValue + 1);

  const setSort = (fieldKey) => {
    setSortDir((prevValue) => (prevValue === "asc" ? "desc" : "asc"));
    setSortField(fieldKey);
  };

  const onChangeFilter = (data) => {
    setSelectedColumns(data);
    const newSettings = {
      ...settings,
      [SETTINGS_KEYS.selectedColumns]: JSON.stringify(data),
    };
    widgetApi.setSettings(newSettings);
  };

  if (error) {
    return <ErrorMessage error={error.message} />;
  }

  if (loading && issues.length === 0) {
    return <LoadingIssues />;
  }

  return (
    <Container>
      <Header>
        <TextEpsilon>
          {"Issues"}
          {total > 0 ? ` (${total})` : ""}
        </TextEpsilon>
        <div style={{ display: "flex" }}>
          <IssueSearch widgetApi={widgetApi} rootUrl={rootUrl} />
          <Spacer width={margin300} />
          <ColumnsFilter
            onChangeFilter={onChangeFilter}
            selectedColumns={selectedColumns}
          />
        </div>
      </Header>
      <div style={{ overflow: "auto", display: "flex" }}>
        <StyledListStripedContainer
          style={{ flex: 1 }}
          selectedColumns={selectedColumns}
        >
          <ListHeader
            headers={AVAILABLE_COLUMNS.filter(({ field }) =>
              selectedColumns.includes(field),
            )}
            sortDir={sortDir}
            sortField={sortField}
            sortFn={setSort}
          />
          {issues.map((issue) => (
            <Issue
              key={issue.id}
              issue={issue}
              rootUrl={rootUrl}
              selectedColumns={selectedColumns}
            />
          ))}
        </StyledListStripedContainer>
      </div>
      <Footer>
        <LoadMoreContainer>
          {hasMore && !loading && (
            <ButtonSecondary text="Load more" onClick={loadMore} />
          )}
          {issues.length > 0 && loading && !onLoadingSort && (
            <Loader containerHeight="40px" />
          )}
        </LoadMoreContainer>
      </Footer>
    </Container>
  );
};
const Container = styled.div`
  width: 100%;
  padding: ${padding300};
  background-color: ${white};
  border-radius: ${radius500};
`;
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const Footer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const LoadMoreContainer = styled.div`
  margin-top: ${margin300};
  min-width: 100px;
`;

const StyledListStripedContainer = styled(ListStripedContainer)`
  box-shadow: none;
  padding: 0;
  background-color: transparent;
  > li {
    display: grid;
    grid-template-columns: ${({ selectedColumns }) =>
      AVAILABLE_COLUMNS.filter(({ field }) => selectedColumns.includes(field))
        .map(({ gridWidth }) => gridWidth)
        .join(" ")};
    > div {
      width: auto;
    }
  }
`;

export default IssueList;
