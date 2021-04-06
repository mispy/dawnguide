import { md, defineLesson } from '../lesson'
// @ts-ignore
import sungraph from './img/sungraph.png'


// The sun's vast gravitational fusion reactor is the upstream source of metabolic energy for [almost](https://en.wikipedia.org/wiki/Chemotroph) all life on the planet. Not being photosynthetic ourselves, humans access this energy through the intermediary of the plant life that we eat (and other plant-eating organisms we eat in turn).

// While our metabolic relationship is indirect, we also directly rely on the sun for light and warmth, especially in our evolutionary past when we could not easily generate these things with electricity. So it is not too surprising that human minds have a complex relationship with sunlight.


export default defineLesson({
    type: 'reading',
    id: 'sunlight',
    slug: 'sunlight',
    title: 'Why sunlight is important for mental health',
    subtitle: "Syncs sleep cycles and inhibits serotonin to melatonin conversion. You can reproduce this with really bright artificial lights",
    summaryLine: "",
    text: md`
Like many people in covid times, I didn't go outside much over the last year. Being a reclusive programmer type with social anxiety, I didn't really get out that much to begin with, and I also sleep quite inconsistently (sometimes going completely nocturnal). So I don't see a whole lot of sunlight! I thought that if I learn some science about the sun and psychology, I'll feel more excited to develop good habits there.

"Umm Mispy," you might ask, "are you sure it's sunlight in particular you're missing, given that going outside usually involves physical activity and social interaction too?" Well, true, those things are also really important. But I think the sun is particularly neat to learn about. It's an ancient fusion reactor that is the upstream source for almost all metabolic energy in the biosphere. So I want to be better friends with it.

Sunlight and mood are particularly studied in the context of [seasonal affective disorder](https://en.wikipedia.org/wiki/Seasonal_affective_disorder), which is when people get depressed at certain times of the year (usually but not always winter). SAD affects people primarily at latitudes where there is significant seasonal variation in sunlight, and days become much shorter in the winter.

<figure class="wide">
    <img src="${sungraph}" alt="Visualization comparing sunlight hours in Copenhagen and Perth"/>
    <figcaption>2021 sun graphs from [timeanddate.com](https://www.timeanddate.com/), with the winter solstice highlighted. On the shortest day of the year in each place, Perth has 3 more total hours of sunlight. As an Australian, I found visiting Denmark in winter an interesting experience!</figcaption>
</figure>

There's a compelling reason to believe SAD is to do with light itself and not something downstream like temperature: you can treat it by shining bright lights at people, with comparable efficacy to antidepressants like fluoxetine.[@lam2006can] Bright light therapy uses lights with output in the range of 2,500-10,000 <a href="https://en.wikipedia.org/wiki/Lux">lux</a>, much closer to the brightness of indirect daylight than the 50-500 lux of regular indoor lighting. "The minimal intensity of artificial light that appears necessary for an antidepressant effect in SAD is 2500 lux for two hours, or alternatively, a brighter light exposure of 10,000 lux for 30 minutes."[@tuunainen2004light]

More rigorous meta-analyses on light therapy research tend to exclude a lot of studies, partly because it's really hard to do a _blinded_ placebo trial involving _light_.[@golden2005efficacy] Still, they come out positive. Notably, bright light therapy also helps for regular (non-seasonal) depression, with a more modest effect size.[@tuunainen2004light] I'd guess that the lower effect size might be because it's specifically helpful for people who aren't already getting enough sunlight, which would be a smaller percentage of depressed-people-as-a-whole than for the group reporting seasonal depression.

There are also some fun observational studies to consider. My favorite is classic 1996 one where a Canadian hospital found that severely depressed patients who stayed in the rooms with lots of morning sun recovered ~15% faster, an entirely accidental [natural experiment](https://en.wikipedia.org/wiki/Natural_experiment).[@beauchemin1996sunny]

How does sunlight make people less depressed? Well, because of the difficulty in doing placebo trials, we can't be 100% sure that it's not something higher-level to do with people's beliefs and associations involving light. But there's also a physiological explanation to do with sleep and circadian rhythms.

Mammalian brains have a timekeeping system in a region of the hypothalamus called the suprachiasmatic nucleus, that uses a molecular oscillator clock to govern sleep-wake behavior over a roughly 24-hour period.[@blume2019effects] For it to actually keep us usefully diurnal, the clock needs to be synchronized with the environment, so that our internal idea of "morning" aligns with the local timezone and solar day. This synchronization happens when certain cells of the retina are exposed to daylight, and the effect changes depending on the time of exposure. Light in the circadian-subjective "morning" advances the clock (decreasing time-to-next-sleep), while "evening" light delays it (extending wakefulness).

So, seeing a lot of bright light during the day entrains your circadian rhythm towards sleeping consistently at night. What does this have to do with mental health? Quite a lot, as it turns out! Poor sleep is both a common symptom of and a significant risk factor for depression. Most importantly, it's possible to treat depression by treating poor sleep. A 2019 meta-analysis found that "sleep interventions had a large effect on depression symptoms", and that "the effect on depression symptoms was moderated by the size of the effect on subjective sleep quality".[@gee2019effect]

Sleep is also regulated by the hormone melatonin, which is produced in response to darkness and suppressed by exposure to daylight. Notably, what's actually suppressed by light is the conversion of the precursor molecule serotonin into melatonin. This means that sunlight (and possibly other sleep interventions) may have a similar biological effect to [SSRI antidepressants](https://en.wikipedia.org/wiki/Selective_serotonin_reuptake_inhibitor).

In conclusion: sunlight is important for good sleep, and good sleep is important for mental health. As a reclusive remote freelancer, I'd previously viewed daylight and a consistent sleep schedule as things nice to have but not particularly _essential_; I've upgraded my estimation of their importance considerably in light (heh) of the research causatively connecting it to good mental health.

Some takeaways:

- Improving sleep quality generally makes people a lot happier
- Bright lights in the morning shift sleep cycle earlier; in the evening, they shift it later
- Go outside during the day; morning walks or runs are especially ideal
- Sleep with your window blinds open, for that nice morning light rhythm-entrainment
- Prefer darker environments in the evening where you can brew up some melatonin
- If you can't get enough natural sunlight, consider getting a [light therapy lamp](https://www.verywellmind.com/best-light-therapy-lamps-4172537)

We'll see if I can encourage myself to go for more morning walks! If not, at least I've now bought a dawn simulator alarm clock. It glows and makes cute bird noises.
`,
    furtherReading: md`
The 2019 paper <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6751071/">Effects of light on human circadian rhythms, sleep and mood</a> by Christine Blume, Corrado Garbazza, and Manuel Spitschan is a nice overview of what we know about the neurobiology. I also liked the earlier 2008 <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC2290997/">Benefits of Sunlight: A Bright Spot for Human Health</a> by M. Nathaniel Mead, which approaches it more from a general medical perspective and talks about some other stuff like vitamin D and the tradeoff with UV radiation.
    `,
    exercises: [
        {
            id: 'sunlight-1',
            type: 'fillblank',
            question: "",
            possibleAnswers: [
                'relax'
            ]
        },
    ],
    bibliography: `
@article{beauchemin1996sunny,
    title={Sunny hospital rooms expedite recovery from severe and refractory depressions},
    author={Beauchemin, Kathleen M and Hays, Peter},
    journal={Journal of affective disorders},
    volume={40},
    number={1-2},
    pages={49--51},
    year={1996},
    publisher={Elsevier},
    scihub={https://sci-hub.st/https://www.sciencedirect.com/science/article/abs/pii/0165032796000407}
}

@article{golden2005efficacy,
    title={The efficacy of light therapy in the treatment of mood disorders: a review and meta-analysis of the evidence},
    author={Golden, Robert N and Gaynes, Bradley N and Ekstrom, R David and Hamer, Robert M and Jacobsen, Frederick M and Suppes, Trisha and Wisner, Katherine L and Nemeroff, Charles B},
    journal={American Journal of Psychiatry},
    volume={162},
    number={4},
    pages={656--662},
    year={2005},
    publisher={Am Psychiatric Assoc},
    url={https://ajp.psychiatryonline.org/doi/full/10.1176/appi.ajp.162.4.656}
}

@article{lam2006can,
    title={The Can-SAD study: a randomized controlled trial of the effectiveness of light therapy and fluoxetine in patients with winter seasonal affective disorder},
    author={Lam, Raymond W and Levitt, Anthony J and Levitan, Robert D and Enns, Murray W and Morehouse, Rachel and Michalak, Erin E and Tam, Edwin M},
    journal={American Journal of Psychiatry},
    volume={163},
    number={5},
    pages={805--812},
    year={2006},
    publisher={Am Psychiatric Assoc},
    url={https://ajp.psychiatryonline.org/doi/full/10.1176/ajp.2006.163.5.805}
}

@article{tam1995treatment,
    title={Treatment of seasonal affective disorder: a review},
    author={Tam, Edwin M and Lam, Raymond W and Levitt, Anthony J},
    journal={The Canadian Journal of Psychiatry},
    volume={40},
    number={8},
    pages={457--466},
    year={1995},
    publisher={SAGE Publications Sage CA: Los Angeles, CA},
    scihub={https://sci-hub.st/https://journals.sagepub.com/doi/abs/10.1177/070674379504000806}
  }

  @article{tuunainen2004light,
    title={Light therapy for non-seasonal depression},
    author={Tuunainen, Arja and Kripke, Daniel F and Endo, Takuro},
    journal={Cochrane Database of Systematic Reviews},
    number={2},
    year={2004},
    publisher={John Wiley \& Sons, Ltd},
    url={https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD004050.pub2/full}
  }

  @article{lambert2002effect,
    title={Effect of sunlight and season on serotonin turnover in the brain},
    author={Lambert, Gavin W and Reid, C and Kaye, David M and Jennings, Garry L and Esler, Murray D},
    journal={The Lancet},
    volume={360},
    number={9348},
    pages={1840--1842},
    year={2002},
    publisher={Elsevier},
    scihub={https://sci-hub.st/https://www.sciencedirect.com/science/article/abs/pii/S0140673602117375}
  }

  @article{blume2019effects,
    title={Effects of light on human circadian rhythms, sleep and mood},
    author={Blume, Christine and Garbazza, Corrado and Spitschan, Manuel},
    journal={Somnologie},
    volume={23},
    number={3},
    pages={147--156},
    year={2019},
    publisher={Springer},
    url={https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6751071/}
  }

  @article{gee2019effect,
    title={The effect of non-pharmacological sleep interventions on depression symptoms: a meta-analysis of randomised controlled trials},
    author={Gee, Brioney and Orchard, Faith and Clarke, Emmet and Joy, Ansu and Clarke, Tim and Reynolds, Shirley},
    journal={Sleep medicine reviews},
    volume={43},
    pages={118--128},
    year={2019},
    publisher={Elsevier},
    pdf={http://centaur.reading.ac.uk/79287/1/Gee%20et%20al.%20Revised%20Manuscript%20File%20%2528clean%20version%2529.pdf}
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