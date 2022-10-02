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

Currently this is in a beta stage, but feedback is welcome. Feel free to raise github issues. I am particularly keen to get feedback from people that are not from Australian or the USA (we have those covered pretty well in a private chat group, but still log issues). If anyone wants to help with documentation (expecially if it's a how to set things up using different weather integration please raise an issue so we can talk about how to include it).

---

TODO [The above will be removed from the readme before the first release (or at least updated).]

# Overview

This is a fully customisble weather card with a graphical configuration. It has been patterned after the original Dark-Sky animated weather card (https://github.com/iammexx/home-assistant-config/tree/master/ui/darksky), and a forked variant, the BOM Weather Card (https://github.com/DavidFW1960/bom-weather-card). The aim is that this card is usable by people everywhere and be able to deal with your sensors no matter what integration(s) provides them. To get the most from the card you may need to look at what various weather integrations provide in addition to the standard weather entity.

![Platinum Weather card](https://raw.githubusercontent.com/Makin-Things/platinum-weather-card/master/images/platinum-weather-card.png)

The design goals for the card are:

- Totally configurable with a gui editor (no more yaml)
- Provide an upgrade path from @DavidFW1960 custom-weather-card (we are working very closely to ensure this works)
- A ridiculous amount of flexibilty, as we can not possibbly guess everyone's use case

There has been a lot of code reused, but this card has effectively been rewritten from the ground up to make it more flexible.

# Installation

This plugin is now part of the default HACS store. Install card from HACS (note that it requires HACS 1.26.0 or greater) the same way you do for other plugins. After installing the card you can add as many instances of the card the the dashboard as you desire. Due to the complexities of the card (icons/split code for performance) it is not recommended you do a manual install (also you don't get automatic updates offered, please use HACS!).

# Getting Started

You MUST have already configured at least one weather integration to provde data for the card to use. As with all cards they only visualise data from backend entities. There are numerous weather integrations available in both the core and HACS. You will need to find one that is best suited to your location (some countries have multiple options with varying degrees of accuracy). It is possible to use entities from multiple integrations (it may require the use of template sensors to extract what you need).
When you first create a card it will show nothing until you go and select the entities you want to use in the GUI config, so a card that looks like this is not an error, but just needs configuring.

![Unconfigured card](https://raw.githubusercontent.com/Makin-Things/platinum-weather-card/master/images/unconfigured-card.png)

Most of the configuration should be reasonably obvious, but the following sections give more details. It is recommended that you at least have a read of both the 'Concepts' and 'Sections'. After that it is more of a reference for the various parts of the card if you need more information.

# Concepts

The card has sections, any of these sections can be enabled/disabled and reordered to suit your individual needs. Each section has its own configuration pages for the selection of entities and to control display and styling.

![Platinum Weather card](https://raw.githubusercontent.com/Makin-Things/platinum-weather-card/master/images/all-sections-highlighted.png)

It is understood that everyone's use case may be different (and you may have limited data depending on the weather integration you are using), the default settings are aimed at maintaining compatibiltiy with the old bom/custom/darksky weather card that we are aiming to deprecate.
There is no reason that all of your weather data needs to be shown on a single card. This card allows you to have multiple instances with different configurations to achieve what you want.

Rather than putting everything in one gigantic card it is possible to create a few smaller cards, with each having a lot of options of disabled. For example, you could choose to put observations on one card and forecast information on another.

# Sections

As mentioned above this new card allows you to enable/disable/reorder the sections. These are the sections currently available (we are thinking about adding more).

On the cards main configuration dialog, use the switch to completely remove a section if it is not required. This will result in that section taking up absolutely no space on the card. Use the up/down buttons to reorder the sections as desired. The Global Options contains settings that have an effect on multiple sections.

TODO [All of these bits will need better expanations re: details]
TODO [In all of these sections add and explanation of individual settings]

## Overview Section

This section as the name suggests, adds an overview section to the card.

![Platinum Weather card](https://raw.githubusercontent.com/Makin-Things/platinum-weather-card/master/images/overview-section-highlighted.png)

There are 3 different layout options to choose from for the overview section. There are 'complete', 'observations' and 'forecast'.

<caption>Complete</caption>

![Platinum Weather card](https://raw.githubusercontent.com/Makin-Things/platinum-weather-card/master/images/overview-section-complete.png 'Complete')

<caption>Observations</caption>

![Platinum Weather card](https://raw.githubusercontent.com/Makin-Things/platinum-weather-card/master/images/overview-section-observations.png 'Observations')

<caption>Forecast</caption>

![Platinum Weather card](https://raw.githubusercontent.com/Makin-Things/platinum-weather-card/master/images/overview-section-forecast.png 'Forecast')

The fields available to fill in will be altered based on the layout chosen.

| Option name                           | Type    | Description                                                                                                                                                     |
| ------------------------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Card Title Line 1                     | String  | Optional text that should be displayed as the cards title                                                                                                       |
| Card Title Line 2                     | String  | Optional text that should be displayed as the cards title                                                                                                       |
| Entity Update Time                    | Entity  | Optionally defines the entity to use for the timestamp. The entities state MUST provide a valid timestamp in RFC 3339 format (ie. `yyyy-mm-ddThh:mm:ss+offset`) |
| &nbsp;&nbsp;&nbsp;&nbsp;Use Attribute | Boolean | If this is enabled you will then be able to choose an attribute of the above entity to use for the timestamp                                                    |
| &nbsp;&nbsp;&nbsp;&nbsp;Attribute     | String  | The attribute that contains the timestamp                                                                                                                       |
| Update Time Preix                     | String  | Optional text to include as a prefix to the timestamp                                                                                                           |
| Entity Current Temperature            | Entity  | The entity that contains the current temperature                                                                                                                |
| Entity Apparent Temperature           | Entity  | An optional entity that contains the apparent 'feels like' temperature                                                                                          |
| Entity Current Conditions             | Entity  | The entity that contains the name of the icon display                                                                                                           |
| Entity Current Text                   | Entity  | The entity that contains the short headline weather forecast. This should be limited to an entity that will contain only a few words                            |

The various entity fields can either be a sensor that provides the value in its state, or in the case where the integration being used simply provides a sensor in the weather.\* domain you can just select that entity and the correct attribute will be used.

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

# YAML Reference

This reference is here for completeness. All settings can be configured using the GUI so you should not need to refer to this. The options are split into global settings and a section for each of the sections in the card.

## Global Settings

| Variable                    | Type    | Default                                                         | Description                                                         |
| --------------------------- | ------- | --------------------------------------------------------------- | ------------------------------------------------------------------- |
| type                        | string  | null                                                            | Must be `custom:platinum-weather-card`                              |
| section_order               | list    | `- overview`<br>`- extended`<br>`- slots`<br>`- daily_forecast` | Specifies the order in which the sections are displayed on the card |
| show_section_overview       | boolean | `true`                                                          | Specifies if the overview section is visible                        |
| show_section_extended       | boolean | `true`                                                          | Specifies if the extended section is visible                        |
| show_section_slots          | boolean | `true`                                                          | Specifies if the slots section is visible                           |
| show_section_daily_forecast | boolean | `true`                                                          | Specifies if the daily_forecast section is visible                  |
| tap_action                  | action  | none                                                            | Specifies what action to perform when the card is tapped            |
| hold_action                 | action  | none                                                            | Specifies what action to perform when the card is held              |
| option_static_icons         | boolean | false                                                           | Set to true to use non-animated icons                               |
| option_time_format          | string  | `system`                                                        | Can be one of `system`, `12hour` or `24hour`                        |
| option_locale               | string  | none                                                            | The locale to use when formatting timestamps                        |
| text_update_time_prefix     | string  | none                                                            | Specifies a string to prepend to the update time                    |

## Overview Settings

| Variable                       | Type    | Default    | Description                                                                                                             |
| ------------------------------ | ------- | ---------- | ----------------------------------------------------------------------------------------------------------------------- |
| overview_layout                | string  | `complete` | Can be one of `complete`, `observations`, `forecast` or `title only`. Sets the layout to use for the overview section   |
| option_show_overview_decimals  | boolean | `false`    | Show one decimal place on current and apparent temperature                                                              |
| option_show_overview_separator | boolean | `false`    | Show separator at bottom of overview section                                                                            |
| text_card_title                | string  | none       | Line 1 of the cards title                                                                                               |
| text_card_title_2              | string  | none       | Line 2 of the cards title                                                                                               |
| entity_update_time             | string  | none       | The name of the entity that provides the update time. It uses the entity's state unless ``update_time_use_attr` is true |
| update_time_use_attr           | boolean | `false`    | The name of the attribute that provides the update time                                                                 |
| update_time_name_attr          | string  | none       | The name of the attribute to use for the update time                                                                    |
| entity_temperature             | string  | none       | The name of the entity that provides the current temperature                                                            |
| entity_apparent_temp           | string  | none       | The name of the entity that provides the apparent (feels like) temperature                                              |
| entity_forecast_icon           | string  | none       | The name of the entity that provides todays forecast icon                                                               |
| entity_summary                 | string  | none       | The name of the entity that provides the short forecast summary                                                         |

## Extended Section

| Variable                  | Type    | Default | Description                                                                                 |
| ------------------------- | ------- | ------- | ------------------------------------------------------------------------------------------- |
| entity_extended           | string  | none    | The name of the entity that provides today's extended forecast                              |
| extended_use_attr         | boolean | `false` | The name of the attribute that provides the extended forecast                               |
| extended_name_attr        | string  | none    | The name of the attribute to use for the extended forecast                                  |
| entity_todays_uv_forecast | string  | none    | The name of the entity that provides today's uv forecast to append to the extended forecast |
| entity_todays_fire_danger | string  | none    | The name of the entity that provides today's fire danger to append to the extended forecast |

## Slots Section

| Variable                          | Type    | Default         | Description                                                      |
| --------------------------------- | ------- | --------------- | ---------------------------------------------------------------- |
| slot_l1                           | slot    | `forecast_max`  | The value to show in slot l1. See table below for more detail    |
| slot_l2                           | slot    | `forecast_min`  | The value to show in slot l2. See table below for more detail    |
| slot_l3                           | slot    | `wind`          | The value to show in slot l3. See table below for more detail    |
| slot_l4                           | slot    | `pressure`      | The value to show in slot l4. See table below for more detail    |
| slot_l5                           | slot    | `sun_next`      | The value to show in slot l5. See table below for more detail    |
| slot_l6                           | slot    | `remove`        | The value to show in slot l6. See table below for more detail    |
| slot_l7                           | slot    | `remove`        | The value to show in slot l7. See table below for more detail    |
| slot_l8                           | slot    | `remove`        | The value to show in slot l8. See table below for more detail    |
| slot_r1                           | slot    | `popforecast`   | The value to show in slot r1. See table below for more detail    |
| slot_r2                           | slot    | `humidity`      | The value to show in slot r2. See table below for more detail    |
| slot_r3                           | slot    | `uv_summary`    | The value to show in slot r3. See table below for more detail    |
| slot_r4                           | slot    | `fire_danger`   | The value to show in slot r4. See table below for more detail    |
| slot_r5                           | slot    | `sun_following` | The value to show in slot r5. See table below for more detail    |
| slot_r6                           | slot    | `remove`        | The value to show in slot r6. See table below for more detail    |
| slot_r7                           | slot    | `remove`        | The value to show in slot r7. See table below for more detail    |
| slot_r8                           | slot    | `remove`        | The value to show in slot r8. See table below for more detail    |
| entity_pop                        | string  | none            | Entity required for `pop` and `popforecast`                      |
| entity_pos                        | string  | none            | Entity required for `popforecast` and `possible_today`           |
| entity_possible_tomorrow          | string  | none            | Entity required for `possible_tomorrow`                          |
| entity_rainfall                   | string  | none            | Entity required for `rainfall`                                   |
| entity_humidity                   | string  | none            | Entity required for `humidity`                                   |
| entity_pressure                   | string  | none            | Entity required for `pressure`                                   |
| entity_observed_max               | string  | none            | Entity required for `observed_max` and `temp_maximums`           |
| entity_observed_min               | string  | none            | Entity required for `observed_min` and `temp_minimums`           |
| entity_forecast_max               | string  | none            | Entity required for `forecast_max` and `temp_maximums`           |
| entity_forecast_min               | string  | none            | Entity required for `forecast_min` and `temp_minimums`           |
| entity_temp_next                  | string  | none            | Entity required for `temp_next`                                  |
| entity_temp_next_label            | string  | none            | Entity required for `temp_next`                                  |
| entity_temp_following             | string  | none            | Entity required for `temp_following`                             |
| entity_temp_following_label       | string  | none            | Entity required for `temp_following`                             |
| entity_uv_alert_summary           | string  | none            | Entity required for `uv_summary`                                 |
| entity_fire_danger                | string  | none            | Entity required for `fire_danger`                                |
| entity_wind_bearing               | string  | none            | Entity required for `wind` and `wind_kt`                         |
| entity_wind_speed                 | string  | none            | Entity required for `wind`                                       |
| entity_wind_gust                  | string  | none            | Entity required for `wind`                                       |
| entity_wind_gust_kt               | string  | none            | Entity required for `wind_kt`                                    |
| entity_wind_speed_kt              | string  | none            | Entity required for `wind_kt`                                    |
| entity_visibility                 | string  | none            | Entity required for `visibility`                                 |
| entity_sun                        | string  | none            | Entity required for `sun_next` and `sun_following`               |
| custom1_value                     | string  | none            | Entity required for `custom1`                                    |
| custom1_icon                      | icon    | none            | Name of mdi icon to use for `custom1`                            |
| custom1_units                     | string  | none            | Units to display for `custom1`                                   |
| custom2_value                     | string  | none            | Entity required for `custom2`                                    |
| custom2_icon                      | icon    | none            | Name of mdi icon to use for `custom2`                            |
| custom2_units                     | string  | none            | Units to display for `custom2`                                   |
| custom3_value                     | string  | none            | Entity required for `custom3`                                    |
| custom3_icon                      | icon    | none            | Name of mdi icon to use for `custom3`                            |
| custom3_units                     | string  | none            | Units to display for `custom3`                                   |
| custom4_value                     | string  | none            | Entity required for `custom4`                                    |
| custom4_icon                      | icon    | none            | Name of mdi icon to use for `custom4`                            |
| custom4_units                     | string  | none            | Units to display for `custom4`                                   |
| option_today_temperature_decimals | boolean | `false`         | Show one decimal place for temperature slots                     |
| option_today_rainfall_decimals    | boolean | `false`         | Show one decimal place for rainfall slots                        |
| option_pressure_decimals          | number  | `0`             | Number of decimals to show for air pressure `0`, `1`, `2` or `3` |
| option_color_fire_danger          | boolean | `true`          | Use color attributes from fire danger if set                     |

| Slot              | Description                                                            |
| ----------------- | ---------------------------------------------------------------------- |
| pop               | Possibility of precipitation (eg. 10%)                                 |
| popforecast       | Rainfall forecast (eg. 10% - 15-25mm)                                  |
| possible_today    | Possible rain today (eg. Forecast 15-25mm)                             |
| possible_tomorrow | Possible rain tomorrow (eg. Fore Tom 5-10mm)                           |
| rainfall          | Actual rainfall today (eg. 0mm)                                        |
| humidity          | Current humidity (eg. 67%)                                             |
| pressure          | Current pressure (eg. 1018hPa)                                         |
| observed_max      | Todays observed maximum (eg. Observed Max 14°C)                        |
| observed_min      | Todays observed minimum (eg.Observed Min 3°C)                          |
| forecast_max      | Todays forecast maximum (eg. Forecast Max 19°C)                        |
| forecast_min      | Todays forecast minimum (eg. Forecast Min 1°C)                         |
| temp_next         | The next min or max (eg. Max 19°C)                                     |
| temp_following    | The following min or max (eg. Overnight Min 4°C)                       |
| temp_maximums     | Both the observed and forecast maximums (eg. Obs Max 15°C (Fore 19°C)) |
| temp_minimums     | Both the observed and forecast minimums (eg. Obs Min 13°C (Fore 1°C))  |
| uv_summary        | UV forecast (eg. UV High)                                              |
| fire_danger       | Fire Danger (eg. CATASTROPHIC)                                         |
| wind              | Current wind conditions (eg. W 7 km/h (Gust 11km/h))                   |
| wind_kt           | Current wind conditions (eg. W 4 Kt (Gust 6Kt))                        |
| visibility        | Visibility forecast (eg. 24.1km)                                       |
| sun_next          | The next sunrise or sunset (eg. Mon 06:38)                             |
| sun_following     | The following sunrise or sunset (eg. 19:07)                            |
| custom1           | Use custom 1 fields to select behaviour                                |
| custom2           | Use custom 2 fields to select behaviour                                |
| custom3           | Use custom 3 fields to select behaviour                                |
| custom4           | Use custom 4 fields to select behaviour                                |
| empty             | Leave the slot empty, but don't remove the space                       |
| remove            | Remove the slot entirely                                               |

## Daily Forecast Section

| Variable                       | Type    | Default      | Description                                                                |
| ------------------------------ | ------- | ------------ | -------------------------------------------------------------------------- |
| daily_forecast_layout          | string  | `horizontal` | Format for layout `horizontal` or `vertical`                               |
| daily_forecast_days            | number  | `5`          | Number of days to include in forecast. `horizontal (1-5)` `vertical (1-7)` |
| option_tooltips                | boolean | `false`      | Show forecast tooltips on horizontal forecast                              |
| daily_extended_forecast_days   | number  | `7`          | Show extended forecast. (only for vertical forecast `(1-7)`)               |
| option_daily_color_fire_danger | boolean | `true`       | Use color attributes from fire danger if set (oly for vertical forecast)   |

[license-shield]: https://img.shields.io/github/license/makin-things/platinum-weather-card.svg?style=for-the-badge
[releases-shield]: https://img.shields.io/github/release/makin-things/platinum-weather-card.svg?style=for-the-badge
[releases]: https://github.com/makin-things/platinum-weather-card/releases
