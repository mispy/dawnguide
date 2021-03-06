import { md, defineLesson } from '../lesson'
// @ts-ignore
import featured from './img/pmr.jpg'

export default defineLesson({
    type: 'reading',
    id: 'progressive-muscle-relaxation',
    slug: 'progressive-muscle-relaxation',
    title: 'Progressive muscle relaxation',
    subtitle: "Practicing to tense and relax muscles in sequence can help with anxiety and insomnia",
    summaryLine: "Practicing to tense and relax muscles in sequence can help with anxiety and insomnia",
    publishedDate: "2021-03-08",
    featuredImg: featured,
    text: md`
Progressive muscle relaxation is a stress-reduction exercise in which you slowly tense and relax muscle groups in sequence. It is an evidence-supported treatment for anxiety[@manzoni2008relaxation] and insomnia[@taylor2010treatment], as well as psychosomatic aspects of various medical conditions.[@hoyle1993efficacy] PMR has the nice property of being easy to learn and use in an immediate way, like when you're trying to sleep, and I find it has a nice sense of "concreteness" to it due to the physical component. 

The exercise was defined by Edmund Jacobson in the early 1900s.[@jacobson1938progressive] His original version was pretty intense and involved some 30 muscle groups; current forms are more abbreviated. Weirdly, I found that some 5000+ citations of Jacobson's 1938 second edition book were <a href="/img/pmr-misattribution.png">misattributed</a> by Google Scholar to a <a href="https://is.muni.cz/el/phil/podzim2017/PSX_111/um/Jacobson_Progressive_muscle_relaxation_eng.pdf">random two-page document</a> intended for students at Masaryk University in Czechia. It's kind of charming to read because of the poor translation. "Grit both your fists so strong!"

While Jacobson believed it impossible to feel anxious when your muscles are fully relaxed, modern research is not convinced on this point. Anxious people do consistently report tenser muscles than nonanxious controls. However, _perceived_ muscle tension doesn't match that well with the actual physiological contraction measured by electromyography, and it has not consistently been shown that PMR actually decreases muscle tension even though it successfully decreases anxiety.[@pluess2009muscle] PMR works for many people, but we're not entirely sure why-- it may be partly a meditation in disguise, operating on your perceptions as much as on your muscles.[@conrad2007muscle]

Below are instructions for a short version of PMR based on the [University of Michigan Health Library](https://www.uofmhealth.org/health-library/uz2225). If you're interested in the full form as practised by therapists, you might want to look at the Bernstein & Borkovec training manual[@bernstein2000new] that is mentioned in the review papers.

For each muscle group:

1. Breathe in, while tensing the muscles hard (so long as it is not painful).  

2. Maintain tension for ~5 seconds.

3. Breathe out, and suddenly and completely relax the muscle group.

4. Focus your attention on the area as it relaxes. Can you feel how it is different from the tense state?

<br/>

<style>
table td:first-child {
    width: 25%;
}

table td, table th {
    padding: 0.5rem !important;
}
</style>

| Muscle group                           | What to do  |
| -------------------------------------- | ----------- |
| Hands                                  | Clench them. |
| Wrists and forearms                    | Extend them, and bend your hands back at the wrist. |
| Biceps and upper arms                  | Clench your hands into fists, bend your arms at the elbows, and flex your biceps. |
| Shoulders                              | Shrug them (raise toward your ears). |
| Forehead                               | Wrinkle it into a deep frown. |
| Around the eyes and bridge of the nose | Close your eyes as tightly as you can. (Remove contact lenses before you start the exercise.) |
| Cheeks and jaws                        | Smile as widely as you can. |
| Around the mouth                       | Press your lips together tightly. (Check your face for tension. You just want to use your lips.) |
| Back of the neck                       | Press the back of your head against the floor or chair. |
| Front of the neck                      | Touch your chin to your chest. (Try not to create tension in your neck and head.) |
| Chest                                  | Take a deep breath, and hold it for 4 to 10 seconds. |
| Back                                   | Arch your back up and away from the floor or chair. |
| Stomach                                | Suck it into a tight knot. (Check your chest and stomach for tension.) |
| Hips and buttocks                      | Press your buttocks together tightly. |
| Thighs                                 | Clench them hard. |
| Lower legs                             | Point your toes toward your face. Then point your toes away, and curl them downward at the same time. (Check the area from your waist down for tension.) |
 
<SectionReview/>
`,
    exercises: [
        {
            id: 'pmr-definition',
            type: 'fillblank',
            question: "Progressive muscle relaxation is a stress-reduction exercise in which you slowly tense and _____ muscle groups in sequence",
            possibleAnswers: [
                'relax'
            ]
        },
        {
            id: 'pmr-indication',
            type: 'fillblank',
            question: "Muscle relaxation therapy is an evidence-supported treatment for anxiety and ________",
            possibleAnswers: [
                'insomnia'
            ]
        },
        {
            id: 'pmr-tense-time',
            type: 'fillblank',
            question: `For each muscle group in the PMR exercise, you maintain tension for __ seconds`,
            possibleAnswers: [
                '~5'
            ]
        },
        {
            id: 'pmr-relaxation',
            type: 'fillblank',
            question: `In PMR, it's important to focus your _________ on the sensation of relaxing tense muscles`,
            possibleAnswers: [
                'attention'
            ]
        }
    ],
    bibliography: `
@article{manzoni2008relaxation,
    title={Relaxation training for anxiety: a ten-years systematic review with meta-analysis},
    author={Manzoni, Gian Mauro and Pagnini, Francesco and Castelnuovo, Gianluca and Molinari, Enrico},
    journal={BMC psychiatry},
    volume={8},
    number={1},
    pages={1--12},
    year={2008},
    publisher={BioMed Central},
    open={https://bmcpsychiatry.biomedcentral.com/articles/10.1186/1471-244X-8-41}
}

@article{taylor2010treatment,
    title={Treatment of insomnia in adults and children: a practice-friendly review of research},
    author={Taylor, Daniel J and Roane, Brandy M},
    journal={Journal of Clinical Psychology},
    volume={66},
    number={11},
    pages={1137--1147},
    year={2010},
    publisher={Wiley Online Library},
    scihub={https://sci-hub.se/https://doi.org/10.1002/jclp.20733}
}

@article{hoyle1993efficacy,
    title={Efficacy of abbreviated progressive muscle relaxation training: A quantitative review of behavioral medicine research},
    author={Hoyle, Rick H and others},
    journal={Journal of consulting and clinical psychology},
    volume={61},
    number={6},
    pages={1059--1067},
    year={1993},
    publisher={American Psychological Association},
    scihub={https://sci-hub.se/https://doi.org/10.1037/0022-006x.61.6.1059}
}

@article{jacobson1938progressive,
    title={Progressive muscle relaxation},
    author={Jacobson, Edmund},
    journal={J Abnorm Psychol},
    volume={75},
    number={1},
    pages={18},
    year={1938},
    url={}
}

@article{pluess2009muscle,
    title={Muscle tension in generalized anxiety disorder: a critical review of the literature},
    author={Pluess, Michael and Conrad, Ansgar and Wilhelm, Frank H},
    journal={Journal of anxiety disorders},
    volume={23},
    number={1},
    pages={1--11},
    year={2009},
    publisher={Elsevier},
    pdf={http://philosonic.com/michaelpluess_construction/Files/Pluess_2009_Muscle%20Tension%20in%20Generalized%20Anxiety%20Disorder%20-%20A%20Critical%20Review%20of%20the%20Literature.pdf}
}

@article{conrad2007muscle,
    title={Muscle relaxation therapy for anxiety disorders: It works but how?},
    author={Conrad, Ansgar and Roth, Walton T},
    journal={Journal of anxiety disorders},
    volume={21},
    number={3},
    pages={243--264},
    year={2007},
    publisher={Elsevier},
    scihub={https://sci-hub.se/https://doi.org/10.1016/j.janxdis.2006.08.001}
}

@book{bernstein2000new,
    title={New directions in progressive relaxation training: A guidebook for helping professionals},
    author={Bernstein, Douglas A and Borkovec, Thomas D and Hazlett-Stevens, Holly},
    year={2000},
    publisher={Greenwood Publishing Group},
    libgen={https://libgen.is/book/index.php?md5=1D0BB18720FCC35B6DED2680617AECD9}
}


@article{jacobson1938progressive,
title={Progressive relaxation},
author={Jacobson, E},
year={1938},
publisher={Univ. Chicago Press}
}
`
})

/**

QUOTES

http://philosonic.com/michaelpluess_construction/Files/Pluess_2009_Muscle%20Tension%20in%20Generalized%20Anxiety%20Disorder%20-%20A%20Critical%20Review%20of%20the%20Literature.pdf

Several studies have found elevated muscle tension
(measured by EMG) between anxious and healthy subjects
only during or directly after a mild stress situation (e.g.,
auditory noise) but not during a relaxed state (Balshan,
1962; Goldstein, 1964; Malmo, 1970). In contrast, several
other studies have found reliable differences between
anxious and nonanxious groups even during instructed
relaxation (Fridlund, Hatfield, Cottam, & Fowler 1986;
Hazlett, McLeod, & Hoehn-Saric, 1994; Hoehn-Saric,
Hazlett, Pourmotabbed, & McLeod, 1997; Hoehn-Saric,
McLeod, & Zimmerli 1989; Sainsbury & Gibson, 1954;
Smith, 1973). Based on these studies, elevated muscle
tension appears to be a consistent physiological finding
related to anxiety.

Raskin, Bali, and Peeke (1980), who evaluated this directly,
did not find statistically significant correlations between
muscle tension changes (EMG) and anxiety changes in
their study of treatment of clinically anxious subjects.
Individuals who had the most substantial reductions in
self-reported anxiety were not different from those with
the smallest reductions in terms of their EMG scores or
treatment-related changes in these scores.
*/