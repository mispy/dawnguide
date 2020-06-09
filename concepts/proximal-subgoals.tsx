import { concept } from '../shared/concept'

export default concept({
    id: 'proximal-subgoals',
    title: 'Proximal subgoals',
    tagLine: "Increase motivation by setting and achieving smaller objectives",
    keyFinding: "Increase motivation by setting and achieving smaller objectives",
    author: "Jake Leoht",
    introduction: `
You may have heard it said that it helps to break big tasks into small steps. This is good advice, but we want to know more: why is this helpful, and how can we do it most effectively?

In psychology the steps of a task are called **proximal subgoals**, "proximal" meaning "close by". They are defined relative to _distal goals_ which are our longer-term aims. For example, studying a page in a textbook would be considered a proximal subgoal of the distal goal to learn the material in the chapter. Learning the chapter is itself a proximal goal relative to the more distal aim of mastering the subject, and so on.

Research suggests that proximal subgoals increase motivation by boosting your _perceived self-efficacy_. People are more motivated when they feel the end goal is attainable for them, and subgoals increase this perception of attainability. Importantly, it is not just the initial setting but the _achievement_ of each subgoal that matters. It's like crossing a river by jumping from stone to stone, growing more confident each time.[@stock1990proximal]

When you are already close to completing something, or have high intrinsic interest in the problem, it may be better to focus on the end goal than to set strict subgoals.[@huang2017step] Proximal subgoals are most helpful at the beginning of a new task, when uncertainty about the attainability is highest and it's important to reassure yourself that you can, in fact, do the thing.

Proximal goals work best when they're tied a distal goal that means a lot to you. For example, you may want to do well in school because you are excited about trying a particular career, or because you seek opportunities to help the people you care for. A long-term, self-directed goal gives important emotional context to the work you do in the present, and proximal subgoals in turn give you the structure and confidence to follow through.[@miller2004model]
`,
    furtherReading: `
- [Step by Step: Sub-Goals as a Source of Motivation](https://huangsc.people.stanford.edu/sites/g/files/sbiybj2896/f/step_by_step_obhdp_for_web_1.pdf) by Szu-chi Huang, Liyin Jin and Ying Zhang
`,

    exercises: [
        {
            type: 'fillblank',
            question: "Achieving proximal subgoals can motivate you by increasing perceived ____",
            possibleAnswers: [
                'self-efficacy'
            ]
        },
        {
            question: "At what stage of a task is achieving proximal subgoals likely to be most motivating?",
            answer: "Early on, when you most need confidence that you can complete the task."
        },
        {
            question: "Why is it good to have both proximal goals and distal ones?",
            answer: "Proximal goals give immediate structure to long-term plans, while distal goals give meaning to the present."
        }
    ],
    bibliography: `
    @article{stock1990proximal,
        title={Proximal goal-setting and self-regulatory processes},
        author={Stock, Jennifer and Cervone, Daniel},
        journal={Cognitive therapy and research},
        volume={14},
        number={5},
        pages={483--498},
        year={1990},
        publisher={Springer},
        url={https://sci-hub.tw/https://link.springer.com/article/10.1007/BF01172969}
      }
      
      @article{miller2004model,
        title={A model of future-oriented motivation and self-regulation},
        author={Miller, Raymond B and Brickman, Stephanie J},
        journal={Educational Psychology Review},
        volume={16},
        number={1},
        pages={9--33},
        year={2004},
        publisher={Springer},
        url={https://www.prospectivepsych.org/sites/default/files/pictures/Miller-Brickman_Model-of-future-oriented-motivation-and-self-regulation-2004.pdf}
      }

      @article{huang2017step,
        title={Step by step: Sub-goals as a source of motivation},
        author={Huang, Szu-chi and Jin, Liyin and Zhang, Ying},
        journal={Organizational Behavior and Human Decision Processes},
        volume={141},
        pages={1--15},  
        year={2017},
        publisher={Elsevier},
        url={https://huangsc.people.stanford.edu/sites/g/files/sbiybj2896/f/step_by_step_obhdp_for_web_1.pdf}
      }
      `
})