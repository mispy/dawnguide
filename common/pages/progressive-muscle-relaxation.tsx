import { md, defineLesson } from '../lesson'

/**
 * http://philosonic.com/michaelpluess_construction/Files/Pluess_2009_Muscle%20Tension%20in%20Generalized%20Anxiety%20Disorder%20-%20A%20Critical%20Review%20of%20the%20Literature.pdf
 * 
 * Several studies have found elevated muscle tension
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
 *
 However,
Raskin, Bali, and Peeke (1980), who evaluated this directly,
did not find statistically significant correlations between
muscle tension changes (EMG) and anxiety changes in
their study of treatment of clinically anxious subjects.
Individuals who had the most substantial reductions in
self-reported anxiety were not different from those with
the smallest reductions in terms of their EMG scores or
treatment-related changes in these scores.
 */


export default defineLesson({
    type: 'reading',
    id: 'progressive-muscle-relaxation',
    slug: 'progressive-muscle-relaxation',
    title: 'Progressive muscle relaxation',
    summaryLine: "A stress-reduction exercise where you tense and release muscles in sequence",
    draft: true,
    text: md`
Progressive muscle relaxation is a stress-reduction exercise in which you slowly tense and relax muscle groups in sequence. It is an evidence-supported treatment for anxiety[@manzoni2008relaxation] and insomnia[@taylor2010treatment], as well as psychosomatic aspects of various medical conditions.[@hoyle1993efficacy] PMR has the nice property of being easy to learn and use in an immediate way, like when you're trying to sleep, and I find it has a nice sense of "concreteness" to it due to the physical component. 

The exercise was defined by Edmund Jacobson in the early 1900s.[@jacobson1938progressive] His original version was pretty intense and involved some 30 muscle groups; current forms are more abbreviated. Weirdly, I found that some 5000+ citations of Jacobson's 1938 second edition book were <a href="/img/pmr-misattribution.png">misattributed</a> by Google Scholar to a <a href="https://is.muni.cz/el/phil/podzim2017/PSX_111/um/Jacobson_Progressive_muscle_relaxation_eng.pdf">random two-page document</a> intended for students at Masaryk University in Czechia. It's kind of charming to read because of the poor translation. "Grit both your fists so strong!"

While Jacobson believed muscle tension to be deeply bidirectionally connected to emotion in a physiological way, modern research is not as convinced on this point. Anxious people do consistently have tenser muscles than nonanxious controls. However, people's _perceived_ muscle tension doesn't match well with the actual physiological contraction measured by electromyography, and it has not consistently been shown that decreased muscle tension results in a diminished experience of anxiety.[@pluess2009muscle] PMR works, but we're not entirely sure why-- it may be partly a meditation in disguise, operating on your perceptions as much as on your muscles.[@conrad2007muscle] Like meditation, it becomes more effective the more you practice it.

There are many videos on YouTube that aim to demonstrate PMR. It seems like just about every institution with a tangential interest in stress reduction has made one, so the quality is... variable. Here's a [decent one](https://www.youtube.com/watch?v=5HmCYpbQZbA).

Below is a quick PMR sequence based on [a guide](https://www.octc.co.uk/wp-content/uploads/2016/07/Relaxation-scripts.pdf) by the Oxford Cognitive Therapy Centre.



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
            id: 'average-rem-time',
            type: 'fillblank',
            question: "On average, adults spend ___ of their sleep time in REM",
            possibleAnswers: [
                '25%'
            ]
        },
        {
            id: 'rem-muscles',
            type: 'fillblank',
            question: "During REM sleep, your muscles are _________",
            possibleAnswers: [
                'paralyzed'
            ]
        },
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


@article{jacobson1938progressive,
title={Progressive relaxation},
author={Jacobson, E},
year={1938},
publisher={Univ. Chicago Press}
}
`
})