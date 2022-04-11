const { fetchSearch } = require('../services/zendesk');

exports.getSearch = async (req, res, next) => {
    const { user } = res.locals;
    const { search } = req.query;

    try {
        const searchResult = await fetchSearch(search, user.accessToken);

        res.status(200).send(await searchResult.text());
    } catch (error) {
        console.error('error:', error);
        
        next(error);
    }
};