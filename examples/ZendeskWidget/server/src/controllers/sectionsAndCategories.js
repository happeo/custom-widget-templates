const { fetchCategories, fetchSections } = require("../services/zendesk");

exports.getCategories = async (req, res, next) => {
    try {
        const { user: { accessToken } } = res.locals;
        const query = new URLSearchParams(req.query);
        const categories = await fetchCategories(query.get('page'), accessToken);

        res.status(200).send(await categories.text());
    } catch (error) {
        console.error('error:', error);

        next(error);
    }
};

exports.getSections = async (req, res, next) => {
    try {
        const { user: { accessToken } } = res.locals;
        const query = new URLSearchParams(req.query);
        const sections = await fetchSections(req.params.id, query.get('page'), accessToken);

        res.status(200).send(await sections.text());
    } catch (error) {
        console.error('error:', error);

        next(error);
    }
};