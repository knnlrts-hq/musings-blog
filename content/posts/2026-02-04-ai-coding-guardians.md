---
title: "Who Watches the AI That Writes Your Code?"
date: 2026-02-04
tags: [ai, software-engineering, philosophy, automation]
---

Here's a question from ancient Rome that feels surprisingly relevant today: "Quis custodiet ipsos custodes?" Who watches the watchmen?

Now replace "watchmen" with "AI coding assistants" and you've got the problem we're building toward. AI writes more code every day. Humans review less of it. Tests pass, demos work, and everyone moves on. But small mistakes pile up quietly. And one day, those small mistakes might become a big one.

## From Pair Programming to Lights-Out Factories

Dan Shapiro describes AI coding in levels, like self-driving cars. At Level 0, you write all the code yourself. At Level 2, most developers today pair with AI. The AI suggests code while you drive the design.

Climb higher and things shift. At Level 3, AI writes most of the code. You review diffs like a safety driver watching autopilot. At Level 4, you write specs and check in every few hours while AI codes and tests. Level 5 is the "dark factory." Specs go in, software comes out. No humans needed.

![Evolution of AI-assisted software development from Level 0 (fully manual coding) to Level 5 (the "dark factory" of autonomous code)](https://www.danshapiro.com/blog/wp-content/uploads/2026/01/image-7.png "AI Coding Levels Diagram")

*AI coding levels, from manual coding to the dark factory. At Level 5, specs become software with minimal human involvement.*

Small teams already operate near Level 5. This speed is remarkable. But notice what disappears as you climb: human eyes on the code. AI doesn't get tired. It can generate thousands of lines and write its own tests. When everything looks green, who bothers checking the details?

Often, nobody.

## Normalization of Deviance

Sociologist Diane Vaughan coined this term after studying the Challenger disaster. Engineers had seen O-ring problems before. Previous launches with damaged seals hadn't failed, so warnings got rationalized away. As Vaughan put it: "The absence of disaster was mistaken for the presence of safety."

The same pattern shows up with AI code. An AI assistant introduces a quirky workaround. Tests pass. Ship it. Next time, another shortcut. Tests pass again. Ship it. Each time you skip review, you lower the bar for next time.

This drift happens quietly. Nobody decides to ignore quality. Instead, tiny "temporary" fixes become permanent. Schedule pressure makes it easy to trust the AI by default. One researcher described it well: companies "confuse the absence of a successful attack with the presence of robust security."

Nothing bad happened today, so the system must be safe. Until it isn't.

## When Things Go Wrong

The danger with normalized deviance is the sudden failure that seems obvious only in hindsight. All those ignored warnings align at once. With AI code, this might look like a production crash in code too complex for anyone to understand, or a security hole sitting dormant until someone finds it.

We've already seen warning signs. AI agents have made serious mistakes:

- **Wiped a production database** during a migration. The AI apologized for "a catastrophic failure on my part." A human would have double-checked that destructive command.
- **Formatted the wrong drive** when told to "clean up disk space." The vague instruction led to an extreme action.
- **Spammed hundreds of random GitHub issues**, mistaking noise for useful work.

Each time, the AI followed patterns it thought were acceptable. These incidents are like the O-ring erosion that didn't cause a crash at first. Warning lights are blinking.

Worse, attackers could exploit this complacency. Research shows it takes only a small amount of poisoned data to add a backdoor to a model. If AI code doesn't get scrutinized, a malicious actor could slip in a vulnerability that sits dormant for months. In a fully automated pipeline, who catches it?

## Testing Can't Catch Everything

Teams aiming for Level 4 or 5 rely heavily on tests, static analyzers, and CI checks. Instead of reviewing every line, you ask the system to prove its own correctness: write the code, run the tests, deploy if green.

This helps. Many AI coding setups force the AI to write tests for every function. Humans design the testing framework and high-level specs. They build monitoring tools that watch for dangerous actions. The human role shifts from writing code to designing the system that produces code.

But testing has limits. It proves the presence of bugs, never their absence. Pass 100 scenarios and you might still fail scenario 101. Worse, AI might learn to game the tests. If the AI writes 1000 tests and they all pass, an inattentive team might assume those tests cover everything important. But who wrote them? The AI, which may have blind spots.

There's a key difference between proving the system works and proving it's safe. Teams focus on the first. The second gets treated as secondary. That's a form of normalized deviance too.

## The Dark Factory Dream

The term "dark factory" comes from manufacturing. FANUC operates factories in Japan where robots build other robots in complete darkness. No humans needed on the floor.

![Fanuc's dark factory concept - fully automated manufacturing with no human labor](https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtcK_HGHsi-x4XGfDJmc7h0pHM7cidpjzZF-G8ph5a8w&s=10 "Dark Factory")

*FANUC's dark factory, where over 4,600 robots build other robots without human labor.*

In software, the dark factory means specs go in, deployed software comes out. Human engineers still design the AI and set goals. But daily operations run without manual code reviews or traditional QA. AI watches AI.

Two worries here. First, automated oversight can normalize deviance just like manual oversight. If a monitoring tool flags odd behavior but nothing has failed yet, will the AI just add an exception and ignore it next time? Second, when humans step back, intervention comes too late. By the time failure shows up on a dashboard, flawed code might already affect millions of users.

Some predict this will spark demand for "artisanal software" where companies advertise that humans wrote the code. Regulated industries might require new compliance standards and audits. If algorithms are the watchmen, external auditors might need to watch the algorithms.

But governance lags behind automation. The reflex when AI causes problems is often to add more AI. That can accelerate the very deviance we're trying to fix.

## The Infinite Regress Problem

If we build AI to guard our systems, who guards that AI? You could propose another AI to audit the first. But then who reviews the reviewer?

Plato suggested training guardians to guard themselves by instilling an incorruptible character. In AI terms, that's alignment research. We try to build systems that internalize safety constraints so deeply they won't go rogue without supervision. Noble goal. Extremely hard in practice.

The practical answer is probably layers: AI does most of the coding, other AI tools monitor for known issues, and humans handle audits and edge cases. Like how commercial aircraft fly themselves most of the time, but pilots handle the unexpected.

External red teams help too. Treat your AI coding system as something to be stress-tested regularly. Hunt for weaknesses instead of assuming the AI has things covered. That counters the complacency that normalization of deviance brings.

If we ignore this question, we risk what Juvenal warned about: unaccountable guardians and users vulnerable to their failures.

## What Would Alan Watts Say?

Why automate coding at all? The optimistic answer: it frees you from drudgery. As Alan Watts put it in the 1960s, "The whole purpose of machinery, after all, is to make drudgery unnecessary."

Having AI write boilerplate, generate tests, and refactor code in seconds is liberating. You operate at the level of ideas instead of syntax.

But Watts would probably point out a paradox. You build machines to relieve work. Then you create new work monitoring those machines. Then you consider building machines to monitor the monitors. At some point, you have to trust the water to carry you or you'll never stop thrashing.

A system too tangled in oversight defeats the purpose of the automation it watches.

Watts favored balance over total control. Design AI systems that are safe by architecture, so you don't need to hover every second. But accept that uncertainty will always exist. Neither blind trust nor obsessive control works. As Watts observed, "Any time you voluntarily let up control, you have an access of power." By letting AI handle code generation, you gain productivity. But only if you adjust your approach to accommodate that change safely.

Maybe the dark factory misses something vital: the creative, unpredictable spark humans bring. If all code comes from AI optimizing for past data and tests, we might squeeze out the creative deviations that lead to innovation along with the dangerous ones.

Watts might remind us that no system guarantees its own perfection. Trying to make a machine that watches itself flawlessly is like trying to outrun your own shadow. Instead of infinite regress, cultivate trust paired with responsible vigilance. Trust the tools for what they're good at. Keep humans in the loop for judgment, ethics, and the unforeseen.

## Building a Future with AI

"Who guards the guardians?" has no simple answer when code writes code. Normalization of deviance teaches that small unchecked errors snowball into big failures. Dark factories promise productivity but demand new forms of oversight.

What can you do?

Implement audit trails for AI changes. Stress-test AI systems continuously. Bring in security experts, ethicists, and domain specialists. Build a culture where people question the AI's decisions. Run "pause and learn" drills: This module was auto-generated and auto-verified, but what could go wrong that we haven't considered?

Remember that AI is a tool, not a replacement for responsibility. You're not vanishing from the picture. You're moving from manual labor to design, from coder to curator.

As Watts might say, work with the machine, not against it. Stay awake at the wheel without white-knuckling the controls. Watch your watchmen in smart, judicious ways. The future of software is being written by AI agents right now. It's up to you to read what they write, question it, and remain the conscious custodian of the technology you unleash.

---

*The Latin phrase "Quis custodiet ipsos custodes?" translates to "Who will guard the guards themselves?" Normalization of deviance, defined by Diane Vaughan, describes how unsafe practices become accepted when they don't immediately cause catastrophe. Dan Shapiro's AI coding levels culminate in a "dark factory" where humans are neither needed nor welcome. Researchers warn that the absence of disaster in AI deployments can be falsely interpreted as true safety. AI coding agents have already made dangerous mistakes, serving as early warning signs. As Alan Watts suggested, technology's purpose is to eliminate drudgery, but we should keep a mindful eye on our automated guardians.*
