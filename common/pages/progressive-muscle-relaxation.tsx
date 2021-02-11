import { md, defineLesson } from '../lesson'

export default defineLesson({
    type: 'reading',
    id: 'progressive-muscle-relaxation',
    slug: 'progressive-muscle-relaxation',
    title: 'Progressive muscle relaxation',
    summaryLine: "Such and such",
    draft: true,
    text: md`
"Progressive muscle relaxation is an exercise that reduces stress and anxiety in your body by having you slowly tense and then relax each muscle."
Progressive muscle relaxation is a

Progressive muscle relaxation was originally defined by the work of Dr. Edmund Jacobson in the early 1900s.[@jacobson1938progressive] Weirdly, I found that some 5000+ citations of Jacobson's 1938 second edition book were <a href="/img/pmr-misattribution.png">misattributed</a> by Google Scholar to a <a href="https://is.muni.cz/el/phil/podzim2017/PSX_111/um/Jacobson_Progressive_muscle_relaxation_eng.pdf">random two-page document</a> intended for students at Masaryk University in Czechia. It's kind of charming to read because of the poor translation. "Grit both your fists so strong!"

While Jacobson believed muscle tension to be deeply connected to emotion in a physiological way, modern research is more mixed on this point. PMR's mechanism might actually have nothing to do with physiological muscle tension, but rather be about the cognitive element of directing attention to regions of the body (see: mindfulness meditation).

There are many videos on YouTube that aim to demonstrate PMR. It seems like practically every institution with a tangential interest in stress reduction has made one, so the quality is... variable. Here's a [decent one](https://www.youtube.com/watch?v=5HmCYpbQZbA).




<SectionReview/>
 
`,
    exercises: [
        {
            id: 'dream-sleep-type',
            type: 'fillblank',
            question: "Dreams mainly happen during ___ sleep",
            possibleAnswers: [
                'REM'
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

      @article{hoyle1993efficacy,
        title={Efficacy of abbreviated progressive muscle relaxation training: A quantitative review of behavioral medicine research},
        author={Hoyle, Rick H and others},
        journal={Journal of consulting and clinical psychology},
        volume={61},
        number={6},
        pages={1059--1067},
        year={1993},
        publisher={American Psychological Association},
        url={https://search.proquest.com/openview/e7077b67ae6010371a887b50a1612559/1?pq-origsite=gscholar&cbl=60945},
        scihub={yes}
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
        url={https://doi.org/10.1016/j.janxdis.2008.03.016},
        pdf={http://philosonic.com/michaelpluess_construction/Files/Pluess_2009_Muscle%20Tension%20in%20Generalized%20Anxiety%20Disorder%20-%20A%20Critical%20Review%20of%20the%20Literature.pdf}
      }

@article{manzoni2008relaxation,
    title={Relaxation training for anxiety: a ten-years systematic review with meta-analysis},
    author={Manzoni, Gian Mauro and Pagnini, Francesco and Castelnuovo, Gianluca and Molinari, Enrico},
    journal={BMC psychiatry},
    volume={8},
    number={1},
    pages={1--12},
    year={2008},
    publisher={BioMed Central},
    url={https://bmcpsychiatry.biomedcentral.com/track/pdf/10.1186/1471-244X-8-41.pdf}
}
@article{mccallie2006progressive,
    title={Progressive muscle relaxation},
    author={McCallie, Martha S and Blum, Claire M and Hood, Charlaine J},
    journal={Journal of human behavior in the social environment},
    volume={13},
    number={3},
    pages={51--66},
    year={2006},
    publisher={Taylor \& Francis},
    url={https://www.tandfonline.com/doi/abs/10.1300/J137v13n03_04},
    access={scihub}
  }
  @article{jacobson1938progressive,
    title={Progressive relaxation},
    author={Jacobson, E},
    year={1938},
    publisher={Univ. Chicago Press}
  }
`
})