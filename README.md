# Platinum Weather Card by [@makin-things](https://www.github.com/makin-things)

A highly configurable weather card with a graphical configuration.

[![hacs_badge](https://img.shields.io/badge/HACS-Default-orange.svg?style=for-the-badge)](https://github.com/hacs/integration)
[![GitHub Release][releases-shield]][releases]
[![License][license-shield]](LICENSE.md)
![Maintenance](https://img.shields.io/maintenance/yes/2022?style=for-the-badge)

# Support

Hey dude! Help me out for a couple of :beers: or a :coffee:!

[![coffee](https://www.buymeacoffee.com/assets/img/custom_images/black_img.png)](https://www.buymeacoffee.com/theOzzieRat)

# Current Status

Currently this is in a beta stage, but feedback is welcome. Feel free to raise github issues. I am particularly keen to get feedback from people that are not from Australian or the USA (we have those covered pretty well in a private chat group, but still log issues).

---

TODO [The above will be removed from the readme before the first release (or at least updated).]

# Description

This is a fully customisble weather card with a graphical configuration. The aim is that this card usable by people everywhere and be able to deal with your sensors no matter what integration provides them.

![Platinum Weather card](https://raw.githubusercontent.com/Makin-Things/platinum-weather-card/master/images/platinum-weather-card.png)

The design goals for the card are:

- Totally configurable with a gui editor (no more yaml)
- Provide an upgrade path from @DavidFW1960 custom-weather-card (we are working very closely to ensure this works)
- A ridiculous amount of flexibilty as we can not possibbly guess everyone's use case
- TODO [I need to go back and find our orininal design goals to check I have added everything here]

There has been a lot of reused code, but this card has effectively been rewritten from the ground up to make it more flexible.

# Concepts

The card has sections within the card, any of these sections can be enabled/disabled and reordered to suit your individual needs. Each section has its own configuration pages for the selection of entities and for control display and styling.

TODO [Include an image with some markup]

We understand everyone's use case may be different, the default settings are aimed at maintaining compatibiltiy with the old bom/custom weather card that we are aiming to deprecate.
There is no reason that all of your weather date needs to be show on a single card, this card allows you to have multiple cards with different configurations to achieve what you want.

TODO [Suggest ways to best use multiple cards]

# Sections

As mentioned above this new card allows you to enable/disable/reorder the sections. These are the sections currently available (we are thinking about adding more).

TODO [All of these bits will need better expanations re: details]
TODO [In all of these sections add and explanation of individual settings]

## Title Section

This section as the name suggest adds a title section so that the card can be named and a timestamp diplayed.

TODO [include image of section]

## Overview Section

This section shows the main large section that was previously at the top of the card. TODO [rewite this].

TODO [include image of section]

## Extended Section

A section that shows todays detailed forecast

TODO [include image of section]

## Slots Section

A section to show a bunch of data in 2 colums (up to 8 rows).

TODO [include image of section]

## Daily Forecast Section

Shows the next x days of forecast info in either a horizontal or vertical layout

TODO [include image of section]

## Global options

A page for things that don't neatly fit in other places (ie. they have an effect on multiple sections).

TODO [include image of section]

# Migration from the old card

TODO [need to write this]

# YAML Editor Options

I think we need to make it clear that this should not be used, but just added for reference.

TODO [Detail the options when in yaml mode]

[license-shield]: https://img.shields.io/github/license/makin-things/platinum-weather-card.svg?style=for-the-badge
[releases-shield]: https://img.shields.io/github/release/makin-things/platinum-weather-card.svg?style=for-the-badge
[releases]: https://github.com/makin-things/platinum-weather-card/releases
