import { md, defineLesson } from '../lesson'
// @ts-ignore
import prc from './img/sleep-prc.png'

/*

exposure to low light levels (5–10 lux) at night when sleeping with eyes closed induced a
circadian response

"delay phase shifts in the early subjective night and advance phase shifts in the late subjective night" https://sci-hub.se/https://www.tandfonline.com/doi/abs/10.3109/07420529909016940

All
but one of the PRCs in humans is classified as weak Type 1
(Winfree, 1980): the phase transition curve (PTC) plotting
final phase versus initial phase yields a slope close to 1,
indicating weak phase resetting. Strong Type 0 resetting,
in which the stimulus drives the pacemaker to the same
final phase regardless of initial phase and results in a PTC
with an average slope of 0, is possible in humans following
three consecutive days of exposures to 7,000–12,000 lux
for 5 h (Czeisler et al., 1989).

*/
// Blue light pulse might be more efficient https://physoc.onlinelibrary.wiley.com/doi/pdf/10.1113/jphysiol.2012.239046

// DLMO dim light melatonin onset https://pubmed.ncbi.nlm.nih.gov/16884842/

// Sleep-like behavior is remarkably common across different forms of animal life. Even invertebrates such as fruit flies or sea slugs appear to sleep, despite lacking the brain structures we use to identify sleep phases in humans. The particular way in which sleep manifests depends on the species.[@joiner2016unraveling]

// Response of organism to light is unpredictable during the steep part of PRC https://www.youtube.com/watch?v=gib7_ppLpXI&t=49s

// ## The structure of sleep

// Before we get into what sleep is for and how to do it well, let's take a moment to go over what it _is_.

// | Characteristic            | NREM           | REM         |
// | ------------------------- | -------------- | ----------- |
// | Proportion of sleep cycle | 75-80%         | 20-25%      |
// | Eye movement              | Slow           | Rapid       |
// | Brain activity            | Low            | High        |
// | Muscle tone               | Normal         | Paralyzed   |
// | Dreams                    | Rare           | Common      |
// | Body temperature          | Regulated, low | Unregulated |

export default defineLesson({
    type: 'reading',
    id: 'sleep-and-light',
    slug: 'sleep-and-light',
    title: 'The biology of sleep and sun',
    name: "sleep and light",
    summaryLine: "Sleep and stuff",
    // publishedDate: '2021-05-05',
    text: md`

Light is the key zeitgeber in the circadian system. Dieser "Zeitgeber" being a toll German word meaning "time giver". Basically, the molecular sleepy-clock in your brain evolved to use sunlight to align itself with the local timezone.

<figure>
    <img src="${prc}" alt="Human phase response curve to light"/>
</figure>

The clock responds differently depending on when you see light, in subjective circadian time. If you want to go to bed earlier, set an alarm, go for a walk in the sun just after you get up, and then stick to dimmer lighting later on. Conversely if you want to go to bed later, you could stay in the dark just after waking, and then turn on some bright lights around the time you get sleepy.

Brighter light produces a stronger phase shift effect. Artificial indoor lighting generally ranges around 30-500 <a href="https://en.wikipedia.org/wiki/Lux">lux</a>, while full daylight goes anywhere from 10,000 to 100,000 lux. You can get special light therapy lamps that are more in the intensity range of sunlight; I ended up buying <a href="https://www.amazon.com.au/gp/product/B08G4FGJPT?ref=ppx_pt2_dt_b_prod_image">one of these</a>. Blue light has a stronger effect than red light.[@tahkamo2019systematic]

Even though sunlight is way brighter, standard indoor lighting still has circadian effects. This is why it's suggested to keep your nights as dark as possible for stable sleep. Circadian light sensitivity varies a lot between individuals; some see a substantial phase delay at only 6 lux, while the rare light-insensitive person can go up to 350 before getting the same effect.[@phillips2019high]

The phase response curve to light is influenced by prior photic history.[@chang2011human] This probably means that if you were in a dark room all day and then go somewhere bright in the evening, it'll keep you awake more effectively than if you had just been in a bright room the whole time.

Humans have a relatively weak "type 1" phase response curve to light with <3h shifts. Some other creatures like fruit flies show a much stronger "type 0" curve, where the phase can be completely shifted by 12h with a single light pulse under the right conditions.[@varma2013strong] One old study suggests that if you blast humans with stupid amounts of bright light (~10,000 lux for 5h a day over 3 days), you can get a type 0 curve like some secret factory reset mode, but I'm not sure how real that is.[@jewett1994phase]


<SectionReview cards="dream-sleep-type,average-rem-time,rem-muscles"/>
 
`,
    exercises: [
    ],
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

@article{shrivastava2014interpret,
    title={How to interpret the results of a sleep study},
    author={Shrivastava, Deepak and Jung, Syung and Saadat, Mohsen and Sirohi, Roopa and Crewson, Keri},
    journal={Journal of community hospital internal medicine perspectives},
    volume={4},
    number={5},
    pages={24983},
    year={2014},
    publisher={Taylor \& Francis},
    url={https://www.tandfonline.com/doi/full/10.3402/jchimp.v4.24983}
  }

  @article{ohayon2017national,
    title={National Sleep Foundation's sleep quality recommendations: first report},
    author={Ohayon, Maurice and Wickwire, Emerson M and Hirshkowitz, Max and Albert, Steven M and Avidan, Alon and Daly, Frank J and Dauvilliers, Yves and Ferri, Raffaele and Fung, Constance and Gozal, David and others},
    journal={Sleep health},
    volume={3},
    number={1},
    pages={6--19},
    year={2017},
    publisher={Elsevier},
    pdf={https://drbrucekehr.com/wp-content/uploads/2017/03/NSF-Sleep-Quality-Indicators.pdf}
  }

  @article{czeisler1989bright,
    title={Bright light induction of strong (type 0) resetting of the human circadian pacemaker},
    author={Czeisler, Charles A and Kronauer, Richard E and Allan, James S and Duffy, Jeanne F and Jewett, Megan E and Brown, Emery N and Ronda, Joseph M},
    journal={Science},
    volume={244},
    number={4910},
    pages={1328--1333},
    year={1989},
    publisher={American Association for the Advancement of Science},

  }

  @article{st2012human,
    title={Human phase response curve to a 1 h pulse of bright white light},
    author={St Hilaire, Melissa A and Gooley, Joshua J and Khalsa, Sat Bir S and Kronauer, Richard E and Czeisler, Charles A and Lockley, Steven W},
    journal={The Journal of physiology},
    volume={590},
    number={13},
    pages={3035--3045},
    year={2012},
    publisher={Wiley Online Library},
    url={https://physoc.onlinelibrary.wiley.com/doi/pdfdirect/10.1113/jphysiol.2012.227892}
  }

  @article{chang2011human,
    title={The human circadian system adapts to prior photic history},
    author={Chang, Anne-Marie and Scheer, Frank AJL and Czeisler, Charles A},
    journal={The Journal of physiology},
    volume={589},
    number={5},
    pages={1095--1102},
    year={2011},
    publisher={Wiley Online Library},
    pdf={https://physoc.onlinelibrary.wiley.com/doi/pdf/10.1113/jphysiol.2010.201194}
  }

  @article{varma2013strong,
    title={Strong (type 0) phase resetting of activity-rest rhythm in fruit flies, Drosophila melanogaster, at low temperature},
    author={Varma, Vishwanath and Mukherjee, Narendra and Kannan, Nisha N and Sharma, Vijay Kumar},
    journal={Journal of biological rhythms},
    volume={28},
    number={6},
    pages={380--389},
    year={2013},
    publisher={Sage Publications Sage CA: Los Angeles, CA},
    pdf={https://journals.sagepub.com/doi/pdf/10.1177/0748730413508922}
  }

  @article{jewett1994phase,
    title={Phase-amplitude resetting of the human circadian pacemaker via bright light: a further analysis},
    author={Jewett, Megan E and Kronauer, Richard E and Czeisler, Charles A},
    journal={Journal of biological rhythms},
    volume={9},
    number={3-4},
    pages={295--314},
    year={1994},
    publisher={Sage Publications Sage CA: Thousand Oaks, CA},
    pdf={https://journals.sagepub.com/doi/pdf/10.1177/074873049400900310}
  }

  @article{phillips2019high,
    title={High sensitivity and interindividual variability in the response of the human circadian system to evening light},
    author={Phillips, Andrew JK and Vidafar, Parisa and Burns, Angus C and McGlashan, Elise M and Anderson, Clare and Rajaratnam, Shantha MW and Lockley, Steven W and Cain, Sean W},
    journal={Proceedings of the National Academy of Sciences},
    volume={116},
    number={24},
    pages={12019--12024},
    year={2019},
    publisher={National Acad Sciences},
    url={https://www.pnas.org/content/116/24/12019.full}
  }

  @article{tahkamo2019systematic,
    title={Systematic review of light exposure impact on human circadian rhythm},
    author={Tähkämö, Leena and Partonen, Timo and Pesonen, Anu-Katriina},
    journal={Chronobiology international},
    volume={36},
    number={2},
    pages={151--170},
    year={2019},
    publisher={Taylor \& Francis},
    pdf={https://www.tandfonline.com/doi/pdf/10.1080/07420528.2018.1527773}
  }
`
})