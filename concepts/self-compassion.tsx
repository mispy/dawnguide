import { concept } from '../shared/concept'

export default concept({
    id: 'self-compassion',
    title: 'Self-compassion',
    // subtitle: "Caring for yourself the way you care for friends",
    author: "Jake Leoht",
    draft: true,
    introduction: `
**Self-compassion** involves directing the same sense of caring warmth that you have for others towards yourself. Think of someone important to you, a friend or loved one, and imagine they are suffering in some way. Do you feel your heart moved by their plight, and wish for them to be safe and happy? That feeling of compassion is a beautiful strength of humanity, and intentionally invoking it can help us to deal with negative emotions.[@allen2010self]

Self-compassion is an ancient idea long discussed in Eastern philosophy-- its introduction as a psychological concept comes from the comparatively recent work of Kristin Neff[@neff2003development]. She describes self-compassion as “being open to and moved by one's own suffering, experiencing feelings of caring and kindness toward oneself, taking an understanding, nonjudgmental attitude toward one's inadequacies and failures, and recognizing that one's experience is part of the common human experience”.

Research has shown that self-compassion is a robust resilience factor when faced with feelings of personal inadequacy.[@barnard2011self][@macbeth2012exploring] Rather than criticizing yourself harshly when you fail, self-compassion means showing kindness and understanding in that moment of pain. People who are high in self-compassion take greater responsibility for their failures and make needed changes while maintaining a loving, caring, and patient approach toward themselves.[@leary2007self]

A sense of _common humanity_ is key to self-compassion. You are not alone in your experience of suffering, as all of us are mortal, vulnerable, and imperfect. Anyone can elicit compassion, and there is no shame in needing it. This mindset sidesteps the thoughts of comparison and deservingness those of us with low self-esteem often have. Since all people are worthy of compassion, you are worthy of your own compassion simply by virtue of being a person.

`,
    exercises: [
        {
            question: "How do people high in self-compassion tend to respond to failure?",
            answer: "They take greater responsibility for their failures and are more able to adapt as a result."
        },
        {
            question: "Why is common humanity a key element of self-compassion?",
            answer: "All people are worthy of compassion in their suffering. You are also people."
        },
        {
            question: "How does self-compassion differ from self-esteem?",
            answer: "Self-esteem is based on an evaluation of worth. Compassion on the basis of common humanity is independent of any evaluation."
        }
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
        title={Self-compassion: Conceptualizations, correlates, & interventions},
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