import { concept, md } from '../shared/concept'

export default concept({
    id: 'mental-contrasting',
    title: 'Mental contrasting',
    tagLine: "Find energy to act by contrasting the future you want with obstacles in the present",
    keyFinding: "Find energy to act by contrasting the future you want with obstacles in the present",
    author: "Jake Leoht",
    introduction: md`
When people are not fully occupied in the present, their thoughts often drift towards life and the future. Moments of reflection help us to reconsider strategies and how committed we are to our goals. **Mental contrasting** is a particularly effective structure for reflective thoughts[@oettingen2013mind], following these steps:

- Consider what you want to achieve
    - _Example:_ Do well on exams

- Think about all the good things that will happen once you get there
    - _Example:_ Feeling really good about mastering a subject

- Contrast the good future against the present, by visualizing the obstacles
    - _Example:_ I'll need to overcome procrastination to study

Mental contrasting leads to goal commitment in line with a person’s expectations of success. This means people become more motivated to achieve goals they believe are realistic, and disengage from those they don't, freeing time and attention for alternatives. Intervention studies have examined mental contrasting as a strategy to improve time management[@oettingen2010mental], become physically more active[@sheeran2013gone], deal with chronic disease[@christiansen2010short], and excel in school[@gollwitzer2011mental] among others.

Some different forms of mind wandering, for comparison: 

- Indulging: thinking only about how nice the future will be
- Dwelling: thinking only about the challenges of the present
- Reverse contrasting: thinking about challenges, then thinking about the future

In intervention studies, none of these show the same motivational effectiveness as mental contrasting.[@oettingen2001self] Notably, indulging too much in positive fantasies about the future without contrasting actually seems to harm motivation.[@oettingen2012future] In the case of reverse contrasting, something about the _order_ of the thoughts matters. The framing that emerges from considering the future first, where aspects of the present can then be identified in context as obstacles, seems to be vital.

Because of the expectancy-dependent nature, you might want to be careful with mental contrasting when confidence is low but there are strong reasons to do something anyway. For example, a school student who really does not believe they can do well on exams may be demotivated by mental contrasting. In these cases, it can help to break the problem down using [proximal subgoals](/proximal-subgoals) and then contrast against a subgoal you feel more confident about.

Mental contrasting works particularly well in conjunction with [implementation intentions](/trigger-action-plans), which are a way of translating the goal commitment into concrete actions.[@oettingen2012future]
`,

    furtherReading: md`
- [What Is Mental Contrasting and How to Benefit From It?](https://positivepsychology.com/mental-contrasting/) by Madhuleena Roy Chowdhury
`,
    notes: md`
The psychologists who originally introduced mental contrasting and implementation intentions, Gabriele Oettingen and Peter Gollwitzer respectively, are married to each other! Also, Gabriele is [literally a princess](https://en.wikipedia.org/wiki/House_of_Oettingen-Spielberg). I'm pleasantly amused by the idea of practicing Fantasy Realization Theory as described by _Professor Gabriele Elisabeth Aloisia Notgera Prinzessin zu Oettingen-Oettingen und Oettingen-Spielberg_.
`,
    exercises: [
        {
            type: 'fillblank',
            question: "Mental contrasting is a strategy for motivation that involves contrasting a desired ____ against obstacles in the present",
            possibleAnswers: [
                'future',
                'outcome'
            ],
            successFeedback: "Yep! Research suggests it's a particularly effective way of thinking about the future.",
            reviseFeedback: "Contrasting a desired _future_. Think about where you want to be, then consider how you will get there."
        },
        {
            type: 'fillblank',
            question: `Mental contrasting leads to goal commitment in line with a person's ____ of success`,
            possibleAnswers: [
                'expectations',
                'confidence'
            ],
            successFeedback: "It motivates you more when you are confident the future is realistic to achieve.",
            reviseFeedback: `In line with a person's _expectations_. Contrasting against realistic futures is more motivating.`
        },
        {
            type: 'fillblank',
            question: "Indulging too much in positive ____ about the future without contrasting the present can reduce motivation",
            possibleAnswers: [
                'fantasies',
            ],
            successFeedback: "Right! Make sure to link fantasies about the future to the actions needed to achieve them.",
            reviseFeedback: `Indulging in positive _fantasies_ can be a problem, as it delinks thoughts of success from the effort needed.`
        }
    ],
    bibliography: `
    @article{oettingen2013mind,
        title={Mind wandering via mental contrasting as a tool for behavior change},
        author={Oettingen, Gabriele and Schöwrer, Bettina},
        journal={Frontiers in psychology},
        volume={4},
        pages={562},
        year={2013},
        publisher={Frontiers},
        url={https://www.frontiersin.org/articles/10.3389/fpsyg.2013.00562/full}
      }

    @article{oettingen2010mental,
        title={Mental contrasting of future and reality: Managing the demands of everyday life in health care professionals},
        author={Oettingen, Gabriele and Mayer, Doris and Brinkmann, Babette},
        journal={Journal of Personnel Psychology},
        year={2010},
        publisher={Hogrefe Publishing},
        url={https://econtent.hogrefe.com/doi/full/10.1027/1866-5888/a000018}
      }

      @article{sheeran2013gone,
        title={Gone exercising: Mental contrasting promotes physical activity among overweight, middle-aged, low-SES fishermen.},
        author={Sheeran, Paschal and Harris, Peter and Vaughan, Jennifer and Oettingen, Gabriele and Gollwitzer, Peter M},
        journal={Health Psychology},
        volume={32},
        number={7},
        pages={802},
        year={2013},
        publisher={American Psychological Association},
        url={http://www.psych.nyu.edu/oettingen/Sheeran,%20P.,%20Harris,%20P.,%20Vaughan,%20J.,%20Oettingen,%20G.,%20&%20Gollwitzer,%20P.M.%20(2012).%20Health%20Psychology.pdf}
      }

      @article{christiansen2010short,
        title={A short goal-pursuit intervention to improve physical capacity: A randomized clinical trial in chronic back pain patients},
        author={Christiansen, Sandra and Oettingen, Gabriele and Dahme, Bernhard and Klinger, Regine},
        journal={Pain},
        volume={149},
        number={3},
        pages={444--452},
        year={2010},
        publisher={Elsevier},
        url={https://www.psy.uni-hamburg.de/arbeitsbereiche/paedagogische-psychologie-und-motivation/personen/oettingen-gabriele/dokumente/christiansen-oettingen-2010.pdf}
      }

      @article{gollwitzer2011mental,
        title={Mental contrasting facilitates academic performance in school children},
        author={Gollwitzer, Anton and Oettingen, Gabriele and Kirby, Teri A and Duckworth, Angela L and Mayer, Doris},
        journal={Motivation and Emotion},
        volume={35},
        number={4},
        pages={403--412},
        year={2011},
        publisher={Springer},
        url={https://www.psy.uni-hamburg.de/arbeitsbereiche/paedagogische-psychologie-und-motivation/personen/oettingen-gabriele/dokumente/gollwitzer-oettingen-kirby-2011.pdf}
      }

    @article{oettingen2009mental,
        title={Mental contrasting and goal commitment: The mediating role of energization},
        author={Oettingen, Gabriele and Mayer, Doris and Timur Sevincer, A and Stephens, Elizabeth J and Pak, Hyeon-ju and Hagenah, Meike},
        journal={Personality and Social Psychology Bulletin},
        volume={35},
        number={5},
        pages={608--622},
        year={2009},
        publisher={Sage Publications Sage CA: Los Angeles, CA},
        url={http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.380.1911&rep=rep1&type=pdf}       
      }

      @article{sevincer2017well,
        title={Well self-regulated people use mental contrasting},
        author={Sevincer, A Timur and Mehl, Philipp J and Oettingen, Gabriele},
        journal={Social Psychology},
        year={2017},
        publisher={Hogrefe Publishing},
        url={https://www.psy.uni-hamburg.de/en/arbeitsbereiche/paedagogische-psychologie-und-motivation/personen/sevincer-timur/dokumente/sevincer-mehl-oettingen-2017.pdf}
      }

      @article{oettingen2001self,
        title={Self-regulation of goal-setting: turning free fantasies about the future into binding goals.},
        author={Oettingen, Gabriele and Pak, Hyeon-ju and Schnetter, Karoline},
        journal={Journal of personality and social psychology},
        volume={80},
        number={5},
        pages={736},
        year={2001},
        publisher={American Psychological Association},
        url={https://www.psy.uni-hamburg.de/de/arbeitsbereiche/paedagogische-psychologie-und-motivation/personen/oettingen-gabriele/dokumente/oettingen-pak-schnetter-2001.pdf}
      }

      @article{oettingen2012future,
        title={Future thought and behaviour change},
        author={Oettingen, Gabriele},
        journal={European review of social psychology},
        volume={23},
        number={1},
        pages={1--63},
        year={2012},
        publisher={Taylor & Francis},
        url={https://sci-hub.tw/https://www.tandfonline.com/doi/abs/10.1080/10463283.2011.643698}
      }

      @article{oettingen2013regulating,
        title={Regulating goal pursuit through mental contrasting with implementation intentions.},
        author={Oettingen, Gabriele and Wittchen, Marion and Gollwitzer, Peter M},
        year={2013},
        publisher={Routledge/Taylor & Francis Group},
        urrl={}
      }
`
})