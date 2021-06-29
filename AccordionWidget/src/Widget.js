import React, { useState, useEffect, useCallback, useRef } from "react";
import styled from "styled-components";
import debounce from "lodash.debounce";
import widgetSDK from "@happeo/widget-sdk";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";

import { Tooltip } from "@happeouikit/tooltip";
import { IconChevronRight, IconAdd, IconDelete } from "@happeouikit/icons";
import { padding300, margin300, margin200 } from "@happeouikit/layout";
import { ButtonSecondary, IconButton } from "@happeouikit/buttons";
import { gray08, gray09 } from "@happeouikit/colors";
import { Loader } from "@happeouikit/loaders";
import { ContentRenderer } from "@happeouikit/content-renderer";
import { WIDGET_SETTINGS } from "./constants";
import { divideDataIntoRows, parseStringJSON } from "./utils";

const { happeo, uikit } = widgetSDK;

const EditRow = ({ item, settings, onItemUpdated, removeRow }) => {
  console.log("EditRow");
  return (
    <>
      <EditableAccordionTitle
        style={{ backgroundColor: settings?.headerBackgroundColor }}
      >
        <IconChevronRight
          className="accordion__icon--expand"
          width={24}
          height={24}
          style={{ marginRight: margin300, flexShrink: 0 }}
        />
        <uikit.RichTextEditor
          type="full"
          placeholder="Add title"
          content={item[0]}
          onContentChanged={onItemUpdated}
        />
        <IconButton
          icon={IconDelete}
          onMouseDown={() => removeRow(item.id)}
          type="alert"
          isActionIcon
          aria-label="Remove row"
          data-tip={"Remove row"}
          data-for={`${item.id}-tooltip`}
        />
        <Tooltip id={`${item.id}-tooltip`} />
      </EditableAccordionTitle>
      <EditableAccordionContent
        style={{ backgroundColor: settings?.contentBackgroundColor }}
      >
        <uikit.RichTextEditor
          type="full"
          placeholder="Add content"
          content={item[1]}
          onContentChanged={onItemUpdated}
        />
      </EditableAccordionContent>
    </>
  );
};

const Widget = ({ id, editMode }) => {
  const editRef = useRef();
  const [initialized, setInitialized] = useState(false);
  const [items, setItems] = useState([]);
  const [edidableItems, setEditableItems] = useState([]);
  const [settings, setSettings] = useState({});

  useEffect(() => {
    const doInit = async () => {
      await happeo.init(id);
      happeo.widget.declareSettings(WIDGET_SETTINGS, setSettings);

      setInitialized(true);
      const widgetContent = await happeo.widget.getContent();
      const parsedContent = parseStringJSON(widgetContent, []);
      const dividedContent = divideDataIntoRows(parsedContent);
      setItems(dividedContent);

      if (editMode && parsedContent.length === 0) {
        addRow();
      }
    };
    doInit();
  }, [editMode, id]);

  const onItemUpdated = debounce(
    () => {
      const data = [];
      editRef.current.querySelectorAll(`.fr-element`).forEach((el) => {
        data.push(el.getContent());
      });
      happeo.widget.setContent(JSON.stringify(data));
    },
    1000,
    { leading: false, trailing: true },
  );

  const removeRow = (id) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
    setEditableItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const addRow = () => {
    setItems((prevItems) => [...prevItems, ["", ""]]);
  };

  if (!initialized) {
    return <Loader />;
  }

  return (
    <Container>
      <div className="custom-font-styles">
        {editMode ? (
          <uikit.ProviderWrapper>
            <div ref={editRef}>
              {items.map((item, index) => (
                <EditRow
                  key={index}
                  item={item}
                  onItemUpdated={onItemUpdated}
                  removeRow={removeRow}
                  settings={settings}
                />
              ))}
            </div>
          </uikit.ProviderWrapper>
        ) : (
          <Accordion
            allowMultipleExpanded
            allowZeroExpanded
            settings={settings}
          >
            {items.map((item, index) => (
              <AccordionItem key={index}>
                <AccordionItemHeading>
                  <AccordionItemButton
                    style={{ backgroundColor: settings?.headerBackgroundColor }}
                  >
                    <IconChevronRight
                      className="accordion__icon--expand"
                      width={24}
                      height={24}
                      style={{ marginRight: margin300, flexShrink: 0 }}
                    />

                    <ContentRenderer content={item[0]} type="html" />
                  </AccordionItemButton>
                </AccordionItemHeading>
                <AccordionItemPanel
                  style={{ backgroundColor: settings?.contentBackgroundColor }}
                >
                  <ContentRenderer content={item[1]} type="html" />
                </AccordionItemPanel>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>

      {editMode && (
        <ButtonSecondary
          style={{ marginTop: margin200 }}
          text="New item"
          icon={IconAdd}
          onClick={addRow}
        />
      )}
    </Container>
  );
};

const Container = styled.div`
  .accordion__button {
    cursor: pointer;
    padding: ${padding300};
    background-color: ${gray08};
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    &[aria-expanded="true"] {
      .accordion__icon--expand {
        transform: rotate(90deg);
      }
    }
    .accordion__icon--expand {
      transition: transform 120ms ease-in-out;
    }
    h1,
    h2,
    h3,
    p {
      margin-bottom: 0;
    }
  }
  .accordion__panel {
    padding: ${padding300};
    background-color: ${gray09};
  }
`;
const EditableAccordionTitle = styled.div`
  padding: ${padding300};
  display: flex; 
  flex-wrap; nowrap;
  align-items: center;
  background-color: ${gray08};
  .accordion__icon--expand {
    transform: rotate(90deg);
  }
  h1, h2, h3, p {
    margin-bottom: 0;
  }
`;
const EditableAccordionContent = styled.div`
  padding: ${padding300};
  background-color: ${gray09};
`;

export default Widget;
