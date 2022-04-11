import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { BodyUI, TextBeta, TinyText } from "@happeouikit/typography";
// import LoadingArticle from "./LoadingArticle";
import { getArticle } from "../actions";
import { StyledDrillDownNav, StyledGoBackButton } from "../DrillDownSection/styles";

const Article = ({ widgetApi, onGoBack, id = '' }) => {
  const [articleState, setArticle] = useState({});
  // In case when a single article is shown as a widget "Go button" won't appear
  const goBackButton = useMemo(() => onGoBack && (
    <StyledDrillDownNav>
        <StyledGoBackButton visible onClick={onGoBack} />
    </StyledDrillDownNav>
  ), [onGoBack]);

  useEffect(() => {
    const get = async () => {
      try {
        const token = await widgetApi.getJWT();
        const article = await getArticle(id, token);
        
        if (!articleState.id && article.id) setArticle(article);
        else throw new Error(id ? `There is no such article with id: "${id}".` : 'No article found.');
      } catch (error) {
        console.error(error);
      }
    };

    if (!articleState.id && widgetApi) get();
  }, [widgetApi, articleState]);

  // TODO Show placeholder to reflect loading in progress state
  // if (!articleState.id) return <LoadingArticle />;

  // TODO it's better to use some tools for date formatting
  // if not, then to extract it into a separate util module at least
  return (
    <ArticleWrapper>
      {goBackButton}
      {articleState?.title && (
        <ArticleContent>
          <TextBeta bold>
            {articleState.title}
          </TextBeta>
          <TinyText color="grey">
            Created: {new Date(articleState.created_at).toLocaleDateString(document.documentElement.lang, { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}. Updated: {new Date(articleState.updated_at).toLocaleDateString(document.documentElement.lang, { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </TinyText>
          <br/>
          <BodyUI>
            <StyledSpan dangerouslySetInnerHTML={{ __html: articleState.body }} />
          </BodyUI>
        </ArticleContent>
      )}
    </ArticleWrapper>
  );
};

const StyledSpan = styled.span`
  img {
    max-width: 100%;
  }
`;

const ArticleWrapper = styled.section`
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  flex: 1 1 100%;
`;

const ArticleContent = styled.article`
  ul, ol {
    list-style: initial;
    box-sizing: border-box;
    padding-left: 12px;
  }
`;

export default Article;
