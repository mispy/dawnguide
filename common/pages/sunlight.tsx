import { md, defineLesson } from '../lesson'

export default defineLesson({
    type: 'reading',
    id: 'sunlight',
    slug: 'sunlight',
    title: 'Sunlight',
    summaryLine: "",
    draft: true,
    text: md`
The sun's vast gravitational fusion reactor is the upstream source of metabolic energy for [almost](https://en.wikipedia.org/wiki/Chemotroph) all life on the planet. Not being photosynthetic ourselves, humans access this energy through the intermediary of the plant life that we eat (and other plant-eating organisms we eat in turn).

While our metabolic relationship is indirect, we also directly rely on the sun for light and warmth, especially in our evolutionary past when we could not easily generate these things with electricity. So it is not too surprising that human minds have a complex relationship with sunlight.





 
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