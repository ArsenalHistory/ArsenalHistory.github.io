const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

async function generateFixtures(startYear = 2024, endYear = 2025) {
    //const resultsUrl = 'https://www.arsenal.com/results?field_arsenal_team_target_id=1&field_competition_target_id=All&field_home_away_or_neutral_value=All&field_season_target_id=9584&revision_information=';
    const resultsUrl = 'https://www.arsenal.com/results?field_arsenal_team_target_id=1';
    const fixturesUrl = 'https://www.arsenal.com/fixtures?field_arsenal_team_target_id=1';

    // Fetch the HTML content
    const resultsHtml = (await axios.get(resultsUrl)).data;
    const fixturesHtml = (await axios.get(fixturesUrl)).data;

    // Load the HTML into cheerio
    const results = cheerio.load(resultsHtml);
    const fixtures = cheerio.load(fixturesHtml);

    const resultsArticles = results('article').toArray();
    const fixturesArticles = fixtures('article').toArray();

    const collection = [...resultsArticles.reverse(), ...fixturesArticles];
    //const collection = [...resultsArticles.reverse()];

    const competitions = ["Premier League", "FA Cup", "League Cup", "Carabao Cup"];

    let builder = [];
    builder.push('---');
    builder.push('layout: default');
    builder.push(`title: Season ${startYear} - ${endYear} - Arsenal Results`);
    builder.push(`excerpt: Arsenal season ${startYear} - ${endYear} review. Goals, results, fixtures from the ${startYear} - ${endYear} season on History of Arsenal Football Club`);
    builder.push(`Season: ${startYear}-${endYear}`);
    builder.push('Matches:');

    collection.forEach((element) => {
        const $ = cheerio.load(element); // Wrap the element with cheerio for querying

        const about = $(element).attr('about') || '';

        if (about.includes('fixture') || about.includes('tickets')) {
            const homeaway = $(element).find('.location-icon').attr('title') ||
                ($(element).find('.team-crest__name-value').first().text() === 'Arsenal' ? 'Home' : 'Away') ||
                'Neutral';

            const arsenalScore = $(element).find('.scores__score--arsenal').text() || '';
            const oppositionScore = $(element).find('.scores__score').not('.scores__score--arsenal').text() || '';
            const datetime = $(element).find('time').attr('datetime')?.substring(0, 10) || 'TBC';
            const competition = $(element).find('.event-info__extra').text() || 'League';

            const oppositionTeam = $(element).find('.team-crest__name-value')
                .toArray()
                .map((node) => $(node).text())
                .find((name) => name !== 'Arsenal') || 'TBC';

            if (!competitions.includes(competition)) return;

            builder.push(` - Competition : ${competition}`);
            builder.push(`   Date : ${datetime}`);
            builder.push(`   HomeOrAway : ${homeaway}`);
            builder.push(`   OppositionTeam : ${oppositionTeam}`);
            builder.push(`   ArsenalScore : ${arsenalScore}`);
            builder.push(`   OppositionScore : ${oppositionScore}`);
            builder.push('');
        }
    });

    builder.push('---');
    builder.push('');
    builder.push('{% include league-table.html %}');

    return builder.join('\n');
}

// Main Function
(async () => {
    try {
        const startYear = 2024;
        const endYear = 2025;
        const response = await generateFixtures(startYear, endYear);
        console.log(response);
        fs.writeFileSync(`../_seasons/${startYear}-${endYear}.md`, response);
    } catch (error) {
        console.error('Error:', error.message);
    }
})();
