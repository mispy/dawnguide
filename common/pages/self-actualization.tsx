import { defineLesson, md } from '../lesson'
// @ts-ignore
import featured from './img/self-actualization.png'

export default defineLesson({
    type: 'reading',
    id: 'self-actualization',
    slug: 'self-actualization',
    title: 'Self-actualization',
    featuredImg: featured,
    publishedDate: "2020-06-13",
    subtitle: "Humans have universal needs for things like safety, love, and autonomy",
    summaryLine: "Humans have universal needs for things like safety, love, and autonomy",
    author: "Reece Matthews and Mispy Evenfeld",
    text: md`
Humans, in general, want to improve their lives. Few people believe they are already the most awesome they could be. Instead, each of us has a sense of our potential, an idea of how it might be like if our highest needs are met and we are living each day with full purpose and authenticity. In the theory of humanistic psychology, the pursuit of this fulfillment is called **self-actualization**.

The details of self-actualization have been defined differently by different authors. Often it seems to be more of an aspirational philosophy than a psychological model, encompassing lots of traits considered noble about humans. In this entry, we're thinking of self-actualization mainly as the _fulfillment of needs_. What do humans need to be happy humans?

Evidence supports the idea that there are universal human needs that are predictive of subjective well-being across many different cultures. Here's one way of listing them, taken from a cross-country study[@tay2011needs] based on the Gallup World Poll:

- Basic needs for food and shelter
- Safety and security
- Social support and love
- Self-direction and autonomy
- Feeling respected and pride in activities
- Mastery and growth

If you've heard of [Maslow's hierarchy of needs](https://en.wikipedia.org/wiki/Maslow%27s_hierarchy_of_needs), this will be familiar. However, there isn't actually much evidence for the ordering proposed by Maslow[@wahba1976maslow]; each need instead seems to contribute independently. It's possible, though rarer, to have psychosocial needs fulfilled even before basic and safety needs. Globally speaking, whether you can meet your basic needs easily has a lot to do with the country in which you live, while psychosocial needs vary more with individual conditions.[@tay2011needs]

Which of the universal needs do you think is most important for you right now? What are some ways it could be fulfilled? Focusing on the most pressing need is likely to be most rewarding. For example, if you have a successful career but often feel lonely, you could put more of your focus on "social support and love" than "feeling respected" or "mastery".

> Like vitamins, each of the needs is individually required, just as having much of one vitamin does not negate the need for other vitamins.[@tay2011needs]

It's interesting to think about the relationship between self-actualization and [mindfulness](/mindfulness). While self-actualization encourages us to look to the future, mindfulness is all about immediate sensory experience. These are more compatible perspectives than they seem. Focusing on what we're doing right now can help us work towards the future effectively, and measures of mindfulness and self-actualization have been found to correlate.[@beitel2014stillness]

You don't need to try to self-actualize all by yourself. With friends, family and peers we can help each other fulfill our universal needs, starting with social support and love. Never be afraid to seek advice and comfort from those around you. Reorienting your viewpoint, hearing the viewpoints of others, and critically analysing each need, may reveal what you want to change to move on in your journey through life!

<SectionReview/>
`,

    furtherReading: md`
- [22 Self-Actualization Tests and Tools to Apply Maslow’s Theory](https://positivepsychology.com/self-actualization-tests-tools-maslow/) by Elaine Mead
`,
    exercises: [
        {
            type: 'fillblank',
            question: "Because of their consistency across cultures, humans may be considered to have ____ needs",
            possibleAnswers: [
                'universal',
                'fundamental'
            ],
            successFeedback: "Yep. Each need has many different ways of fulfilling it.",
            reviseFeedback: `_Universal_ needs. They're open-ended, but every culture seems to have them.`
        },
        {
            type: 'fillblank',
            question: "There is no strict hierarchy of needs and each makes an ____ contribution to the whole",
            possibleAnswers: [
                'independent',
            ],
            successFeedback: "Like vitamins!",
            reviseFeedback: `Each makes an _independent_ contribution. One universal need can't be substituted for another.`
        },
        {
            type: 'fillblank',
            question: `We can all ____ each other towards self-actualization`,
            possibleAnswers: [
                'help'
            ],
            successFeedback: "Yep, friends and family are an important part of the journey!",
            reviseFeedback: `We can _help_ each other. It need not be a lonesome quest.`
        },
    ],
    bibliography: `
    @article{tay2011needs,
        title={Needs and subjective well-being around the world.},
        author={Tay, Louis and Diener, Ed},
        journal={Journal of personality and social psychology},
        volume={101},
        number={2},
        pages={354},
        year={2011},
        publisher={American Psychological Association},
        pdf={http://academic.udayton.edu/jackbauer/Readings%20595/Tay%20Diener%2011%20needs%20WB%20world%20copy.pdf}
    }
      @article{wahba1976maslow,
        title={Maslow reconsidered: A review of research on the need hierarchy theory},
        author={Wahba, Mahmoud A and Bridwell, Lawrence G},
        journal={Organizational behavior and human performance},
        volume={15},
        number={2},
        pages={212--240},
        year={1976},
        publisher={Elsevier},
        pdf={http://larrybridwell.com/Maslo.pdf}
      }

      @article{beitel2014stillness,
        title={Stillness and motion: An empirical investigation of mindfulness and self-actualization},
        author={Beitel, Mark and Bogus, Samantha and Hutz, Aida and Green, Dovid and Cecero, John J and Barry, Declan T},
        journal={Person-Centered & Experiential Psychotherapies},
        volume={13},
        number={3},
        pages={187--202},
        year={2014},
        publisher={Taylor & Francis},
        scihub={https://sci-hub.se/https://doi.org/10.1080/14779757.2013.855131}
      }
`
})