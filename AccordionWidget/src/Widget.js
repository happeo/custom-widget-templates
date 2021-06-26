import widgetSDK from "@happeo/widget-sdk";
import React from "react";
import { ButtonPrimary } from "@happeouikit/buttons";
import { BodyUI } from "@happeouikit/typography";
import styled from "styled-components";
//const React = window.React;

const { happeo, uikit } = widgetSDK;

import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";

// const AccordionItem = ({ label, isCollapsed, handleClick, children }) => {
//   return (
//     <>
//       <AccordionTitle onClick={handleClick} text={label} />
//       <AccordionContent isCollapsed={isCollapsed} aria-expanded={isCollapsed}>
//         {children}
//       </AccordionContent>
//     </>
//   );
// };

// const AccordionTitle = styled(uikit.buttons.ButtonPrimary)`
//   border: 0;
//   text-shadow: none;
//   background-color: ${uikit.colors.gray06};
//   padding: ${uikit.layout.padding300};
//   border-radius: 0;
//   width: 100%;
//   color: ${uikit.colors.gray01};
//   :hover {
//     background-color: ${uikit.colors.gray07};
//   }
//   > div {
//     justify-content: flex-start;
//   }
// `;

// const AccordionContent = styled.div`
//   padding: ${uikit.layout.padding300};
//   background-color: ${uikit.colors.gray09};
//   ${({ isCollapsed }) =>
//     isCollapsed
//       ? `
//       display: none;
//   `
//       : `
//       display: block;

//   `}
// `;

// const Accordion = ({ defaultIndex, onItemClick, children }) => {
//   const [bindIndex, setBindIndex] = React.useState(defaultIndex);

//   const changeItem = (itemIndex) => {
//     if (typeof onItemClick === "function") onItemClick(itemIndex);
//     if (itemIndex !== bindIndex) setBindIndex(itemIndex);
//   };
//   const items = children.filter((item) => item.type.name === "AccordionItem");

//   return (
//     <>
//       {items.map(({ props }) => (
//         <AccordionItem
//           isCollapsed={bindIndex !== props.index}
//           label={props.label}
//           handleClick={() => changeItem(props.index)}
//           children={props.children}
//         />
//       ))}
//     </>
//   );
// };

const Widget = ({ id }) => {
  const [initialized, setInitialized] = React.useState(false);
  const [content, setContent] = React.useState({});
  const [context, setContext] = React.useState({});

  React.useEffect(() => {
    const doInit = async () => {
      console.log("int");
      await happeo.init(id);
      setInitialized(true);
      setContext(await happeo.widget.getContext());
      setContent(await happeo.widget.getContent());
    };
    doInit();
  }, [id]);

  if (!initialized) {
    return null; //<Loader />;
  }

  if (context?.location?.editMode) {
    // User is in edit mode
    console.log(uikit);
    return (
      <Container>
        <uikit.contentEditor.Editor
          content="Sed posuere consectetur est at lobortis. Vivamus sagittis lacus vel
          augue laoreet rutrum faucibus dolor auctor. Maecenas sed diam eget
          risus varius blandit sit amet non magna. Donec id elit non mi porta
          gravida at eget metus."
        />
      </Container>
    );
  }

  // User is viewer
  return (
    <Container>
      <ButtonPrimary text="OOOHH YISS" />
      <Accordion>
        <AccordionItem>
          <AccordionItemHeading>
            <AccordionItemButton>
              <BodyUI>What harsh truths do you prefer to ignore?</BodyUI>
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <p>
              Exercitation in fugiat est ut ad ea cupidatat ut in cupidatat
              occaecat ut occaecat consequat est minim minim esse tempor laborum
              consequat esse adipisicing eu reprehenderit enim.
            </p>
          </AccordionItemPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionItemHeading>
            <AccordionItemButton>
              Is free will real or just an illusion?
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <p>
              In ad velit in ex nostrud dolore cupidatat consectetur ea in ut
              nostrud velit in irure cillum tempor laboris sed adipisicing eu
              esse duis nulla non.
            </p>
          </AccordionItemPanel>
        </AccordionItem>
      </Accordion>
    </Container>
  );
};

const Container = styled.div``;

export default Widget;
