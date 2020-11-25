import { defineLesson, md } from '../lesson'

export default defineLesson({
    type: 'reading',
    id: 'self-compassion',
    slug: 'self-compassion',
    title: 'Self-compassion',
    summaryLine: "Become more emotionally resilient by caring for yourself the way you care for friends",
    // subtitle: "Caring for yourself the way you care for friends",s
    author: "Jake Leoht",
    introduction: md`
**Self-compassion** involves directing the same sense of caring warmth that you have for others towards yourself. Think of someone important to you, a friend or loved one, and imagine they are suffering in some way. Do you feel your heart moved by their plight, and wish for them to be safe and happy? That feeling of compassion is a beautiful strength of humanity, and intentionally invoking it can help us to deal with negative emotions.[@allen2010self]

Self-compassion is an ancient idea long discussed in Eastern philosophy-- its introduction as a psychological Lesson comes from the comparatively recent work of Kristin Neff[@neff2003development]. She describes self-compassion as “being open to and moved by one's own suffering, experiencing feelings of caring and kindness toward oneself, taking an understanding, nonjudgmental attitude toward one's inadequacies and failures, and recognizing that one's experience is part of the common human experience”.

Research has shown that self-compassion is a robust resilience factor when faced with feelings of personal inadequacy.[@barnard2011self][@macbeth2012exploring] Rather than criticizing yourself harshly when you fail, self-compassion means showing kindness and understanding in that moment of pain. People who are high in self-compassion take greater responsibility for their failures and make needed changes while maintaining a loving, caring, and patient approach toward themselves.[@leary2007self]

For improving ourselves, we also want to know causation: can people change their thinking to be more self-compassionate, and does that show similar outcomes? From a number of intervention studies, the answer to both seems to be yes[@smeets2014meeting][@shapira2010benefits][@gilbert2006compassionate][@neff2007self]. "CMT (compassionate mind training) resulted in a significant decrease in depression, feelings of inferiority, submissive behavior, shame, and self-attacking tendencies."[@allen2010self] Meta-analysis is supportive but identifies the need for larger-scale RCTs.[@kirby2017meta]

A sense of _common humanity_ is key to self-compassion. You are not alone in your experience of suffering, as all of us are mortal, vulnerable, and imperfect. Anyone can elicit compassion, and there is no shame in needing it. This mindset sidesteps the thoughts of comparison and deservingness those of us with low self-esteem often have. Since all people are worthy of compassion, you are worthy of your own compassion simply by virtue of being a person.
`,
    furtherReading: md`
- [What is self-compassion?](https://self-compassion.org/the-three-elements-of-self-compassion-2/) by Kristin Neff, and her website https://self-compassion.org/ in general. She also voices her own [audiobook on self-compassion](https://www.audible.com.au/pd/Self-Compassion-Step-by-Step-Audiobook/B00FPMXV72?ref=a_library_t_c5_libItem_&pf_rd_p=e313c100-19f4-4637-af63-57e44053b5e7&pf_rd_r=SZ7EA6GZ7HMWZV0YWHZS) which walks you through meditation exercises.

- [Self-Compassion, Stress, and Coping](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC2914331/) by Ashley Batts Allen and Mark R. Leary is the main reference here and a very readable overview for an academic paper.
`,

    exercises: [
        {
            type: 'fillblank',
            question: "Self-compassion involves experiencing feelings of caring and ____ towards oneself",
            possibleAnswers: [
                'kindness',
                'warmth'
            ],
            successFeedback: "Be nice to yourself, as though with a little bird.",
            reviseFeedback: "Feelings of _kindness_! Be nice to yourself, as though with a little bird."
        },
        {
            type: 'fillblank',
            question: "People high in self-compassion tend to take greater ____ for their failures",
            possibleAnswers: [
                'responsibility',
            ],
            successFeedback: "Right! Self-compassion can help you process criticism without becoming too defensive.",
            reviseFeedback: "They take greater _responsibility_. Self-compassion can help you process criticism without becoming too defensive."
        },
        {
            type: 'fillblank',
            question: "Common humanity is a key element of self-compassion because all people experience ____",
            possibleAnswers: [
                'suffering',
                'hardship'
            ],
            successFeedback: "Yep. You are also people!",
            reviseFeedback: "All people experience _suffering_. You are also people!"
        },
    ],
    bibliography: `
    @article{allen2010self,
        title={Self-compassion, stress, and coping},
        author={Allen, Ashley Batts and Leary, Mark R},
        journal={Social and personality psychology compass},
        volume={4},
        number={2},
        pages={107--118},
        year={2010},
        publisher={Wiley Online Library},
        url={https://www.ncbi.nlm.nih.gov/pmc/articles/PMC2914331/}
      }

      @article{barnard2011self,
        title={Self-compassion: Lessonualizations, correlates, & interventions},
        author={Barnard, Laura K and Curry, John F},
        journal={Review of general psychology},
        volume={15},
        number={4},
        pages={289--303},
        year={2011},
        publisher={SAGE Publications Sage CA: Los Angeles, CA},
        url={http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.372.2071&rep=rep1&type=pdf}
      }

      @article{macbeth2012exploring,
        title={Exploring compassion: A meta-analysis of the association between self-compassion and psychopathology},
        author={MacBeth, Angus and Gumley, Andrew},
        journal={Clinical psychology review},
        volume={32},
        number={6},
        pages={545--552},
        year={2012},
        publisher={Elsevier},
        url={https://eprints.gla.ac.uk/64162/1/64162.pdf}
      }

      @article{leary2007self,
        title={Self-compassion and reactions to unpleasant self-relevant events: the implications of treating oneself kindly.},
        author={Leary, Mark R and Tate, Eleanor B and Adams, Claire E and Batts Allen, Ashley and Hancock, Jessica},
        journal={Journal of personality and social psychology},
        volume={92},
        number={5},
        pages={887},
        year={2007},
        publisher={American Psychological Association},
        url={https://self-compassion.org/wp-content/uploads/publications/LearyJPSP.pdf}
      }

      @article{neff2003development,
        title={The development and validation of a scale to measure self-compassion},
        author={Neff, Kristin D},
        journal={Self and identity},
        volume={2},
        number={3},
        pages={223--250},
        year={2003},
        publisher={Taylor & Francis},
        url={https://www.researchgate.net/profile/Beatrice_Ewalds-Kvist/post/what_kind_of_validity_require_for_self_constructed_tool_of_psychological_well_being_scale/attachment/5ad714554cde260d15d97a2c/AS%3A616703100723202%401524044885512/download/Neff.pdf}
      }

      @article{neff2007self,
        title={Self-compassion and adaptive psychological functioning},
        author={Neff, Kristin D and Kirkpatrick, Kristin L and Rude, Stephanie S},
        journal={Journal of research in personality},
        volume={41},
        number={1},
        pages={139--154},
        year={2007},
        publisher={Elsevier},
        url={https://self-compassion.org/wptest/wp-content/uploads/2014/10/JRP.pdf}
      }

      @article{gilbert2006compassionate,
        title={Compassionate mind training for people with high shame and self-criticism: Overview and pilot study of a group therapy approach},
        author={Gilbert, Paul and Procter, Sue},
        journal={Clinical Psychology & Psychotherapy: An International Journal of Theory & Practice},
        volume={13},
        number={6},
        pages={353--379},
        year={2006},
        publisher={Wiley Online Library},
        url={https://www.compassionatemind.co.uk/uploads/files/compassion-group-therapy-paper.pdf}
      }

      @article{shapira2010benefits,
        title={The benefits of self-compassion and optimism exercises for individuals vulnerable to depression},
        author={Shapira, Leah B and Mongrain, Myriam},
        journal={The Journal of Positive Psychology},
        volume={5},
        number={5},
        pages={377--389},
        year={2010},
        publisher={Taylor & Francis},
        url={https://sci-hub.tw/https://www.tandfonline.com/doi/abs/10.1080/17439760.2010.516763}
      }

      @article{smeets2014meeting,
        title={Meeting suffering with kindness: Effects of a brief self-compassion intervention for female college students},
        author={Smeets, Elke and Neff, Kristin and Alberts, Hugo and Peters, Madelon},
        journal={Journal of clinical psychology},
        volume={70},
        number={9},
        pages={794--807},
        year={2014},
        publisher={Wiley Online Library},
        url={https://self-compassion.org/wp-content/uploads/publications/Smeets3week.pdf}
      }

      @article{kirby2017meta,
        title={A meta-analysis of compassion-based interventions: Current state of knowledge and future directions},
        author={Kirby, James N and Tellegen, Cassandra L and Steindl, Stanley R},
        journal={Behavior Therapy},
        volume={48},
        number={6},
        pages={778--792},
        year={2017},
        publisher={Elsevier},
        url={https://charterforcompassion.com.au/wp-content/uploads/2019/12/Kirby-Tellegen-Steindl-2017-meta-analysis.pdf}
      }
`
})

// @article{smeetsself,
//     title={Self-criticism and self-compassion: Risk and resilience},
//     author={Smeets, Elke and Neff, Kristin},
//     journal={Current Psychiatry},
//     volume={15},
//     number={12},
//     pages={18-32},
//     year={2016}
//   }