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
import { Input } from "@happeouikit/form-elements";
import { IconChevronRight, IconAdd, IconDelete } from "@happeouikit/icons";
import { padding300, margin300, margin200 } from "@happeouikit/layout";
import { TextEpsilon } from "@happeouikit/typography";
import { ButtonSecondary, IconButton } from "@happeouikit/buttons";
import { gray08, gray09 } from "@happeouikit/colors";
import { Loader } from "@happeouikit/loaders";
import { ContentRenderer } from "@happeouikit/content-renderer";

const { happeo, uikit } = widgetSDK;

const parseStringJSON = (string = "", defaultVal) => {
  if (string.length === 0) {
    return defaultVal;
  }
  try {
    return JSON.parse(string);
  } catch (_e) {
    return defaultVal;
  }
};

const EditRow = ({ item, onItemUpdated, removeRow }) => {
  const [title, setTitle] = useState(item.title);

  return (
    <EditableAccordionItem>
      <EditableAccordionTitle>
        <IconChevronRight
          className="accordion__icon--expand"
          width={24}
          height={24}
          style={{ marginRight: margin300 }}
        />
        <TextEpsilon style={{ width: "100%" }}>
          <Input
            value={title}
            placeholder="Add title"
            onChange={(e) => {
              setTitle(e.target.value);
              onItemUpdated(item.id, "title", e.target.value);
            }}
          />
        </TextEpsilon>
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
      <EditableAccordionContent>
        <uikit.RichTextEditor
          type="full"
          placeholder="Add content"
          content={item.content}
          onContentChanged={function () {
            const editorContent = this.el.getContent();
            onItemUpdated(item.id, "content", editorContent);
          }}
        />
      </EditableAccordionContent>
    </EditableAccordionItem>
  );
};

const EditableAccordion = styled.div``;
const EditableAccordionItem = styled.div``;
const EditableAccordionTitle = styled.div`
  padding: ${padding300};
  display: flex; 
  flex-wrap; nowrap;
  align-items: center;
  background-color: ${gray08};
  .accordion__icon--expand {
    transform: rotate(90deg);
  }
  input {
    background-color: transparent;
    height: auto;
    border: 0;
    padding: 0;
    font-family: inherit;
    font-size: inherit;
    font-weight: inherit;
    line-height: inherit;
    letter-spacing: inherit;
    color: inherit;
  }
`;
const EditableAccordionContent = styled.div`
  padding: ${padding300};
  background-color: ${gray09};
`;

const Widget = ({ id, editMode }) => {
  console.log("WIDGET RENDERING");
  const [initialized, setInitialized] = useState(false);
  const [items, setItems] = useState([]);
  // const [editableItems, setEditableItems] = useState([]);
  const editableItems = useRef();

  useEffect(() => {
    const doInit = async () => {
      await happeo.init(id);
      setInitialized(true);
      const widgetContent = await happeo.widget.getContent();
      const parsedContent = parseStringJSON(widgetContent, []);
      const buildItems = parsedContent.map((item, index) => ({
        ...item,
        id: item.id || Date.now() + index,
      }));
      editableItems.current = buildItems;
      setItems(buildItems);

      if (editMode && parsedContent.length === 0) {
        addRow();
      }
    };
    doInit();
  }, [editMode, id]);

  const onItemUpdated = debounce(async (id, key, content) => {
    const newItems = editableItems.current.map((rowItem) => {
      if (rowItem.id === id) {
        return {
          ...rowItem,
          [key]: content,
        };
      }
      return rowItem;
    });
    editableItems.current = newItems;

    await happeo.widget.setContent(
      JSON.stringify(
        newItems.map(({ content, title }) => ({
          title,
          content,
        })),
      ),
    );
  }, 1000);

  const removeRow = (id) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const addRow = () => {
    setItems((prevItems) => [
      ...prevItems,
      {
        id: Date.now(),
        title: "",
        content: "",
      },
    ]);
  };

  if (!initialized) {
    return <Loader />;
  }

  return (
    <Container>
      <div className="custom-font-styles">
        {editMode ? (
          <uikit.ProviderWrapper>
            <EditableAccordion>
              {items.map((item) => (
                <EditRow
                  key={item.id}
                  item={item}
                  onItemUpdated={onItemUpdated}
                  removeRow={removeRow}
                />
              ))}
            </EditableAccordion>
          </uikit.ProviderWrapper>
        ) : (
          <Accordion allowMultipleExpanded allowZeroExpanded>
            {items.map((item) => (
              <AccordionItem key={item.id}>
                <AccordionItemHeading>
                  <AccordionItemButton>
                    <IconChevronRight
                      className="accordion__icon--expand"
                      width={24}
                      height={24}
                      style={{ marginRight: margin300 }}
                    />

                    <TextEpsilon>{item.title}</TextEpsilon>
                  </AccordionItemButton>
                </AccordionItemHeading>
                <AccordionItemPanel>
                  <ContentRenderer content={item.content} type="html" />
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
  .accordion {
  }
  .accordion__item {
  }
  .accordion__heading {
  }
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
  }
  .accordion__panel {
    padding: ${padding300};
    background-color: ${gray09};
  }
`;

export default Widget;
