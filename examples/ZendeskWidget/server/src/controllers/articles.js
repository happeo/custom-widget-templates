const { fetchArticles, fetchSectionArticles } = require("../services/zendesk");
  
exports.getArticle = async (req, res, next) => {
  const { user } = res.locals;

  try {
    const articlesResponse = await fetchArticles(req.params.id, user.accessToken);

    res.status(200).send(articlesResponse);
  } catch (e) {
    console.error('error:', e);

    next(e);
  }
};
    
exports.getSectionArticles = async (req, res, next) => {
  const { user: { accessToken } } = res.locals;
  const query = new URLSearchParams(req.query);

  try {
    const articlesResponse = await fetchSectionArticles(req.params.sectionId, query.get('page'), accessToken);

    res.status(200).send(await articlesResponse.text());
  } catch (e) {
    console.error('error:', e);

    next(e);
  }
};
  