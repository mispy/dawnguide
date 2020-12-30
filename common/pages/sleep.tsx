import { md, defineLesson } from '../lesson'

export default defineLesson({
    type: 'reading',
    id: 'sleep',
    slug: 'sleep',
    title: 'Sleep and the mind: how to slumber effectively',
    name: "sleep",
    summaryLine: "Sleep",
    text: md`

 Sleep-like behavior is remarkably common across different forms of animal life. Even invertebrates such as fruit flies or sea slugs appear to sleep, despite lacking the brain structures we use to identify sleep phases in humans. The particular way in which sleep manifests depends on the species.[@joiner2016unraveling]

 
 ## The structure of sleep

Before we get into what sleep is for and how to do it well, let's take a moment to go over what it _is_.

| Characteristic            | NREM           | REM         |
| ------------------------- | -------------- | ----------- |
| Proportion of sleep cycle | 75-80%         | 20-25%      |
| Eye movement              | Slow           | Rapid       |
| Brain activity            | Low            | High        |
| Muscle tone               | Normal         | Paralyzed   |
| Dreams                    | Rare           | Common      |
| Body temperature          | Regulated, low | Unregulated |
 
`,
    exercises: [],
    bibliography: `
@article{joiner2016unraveling,
    title={Unraveling the evolutionary determinants of sleep},
    author={Joiner, William J},
    journal={Current biology},
    volume={26},
    number={20},
    pages={R1073--R1087},
    year={2016},
    publisher={Elsevier}
}
`
})