# Platinum Weather Card by [@makin-things](https://www.github.com/makin-things)

A highly configurable weather card with a graphical configuration.

[![hacs_badge](https://img.shields.io/badge/HACS-Default-orange.svg?style=for-the-badge)](https://github.com/hacs/integration)
[![GitHub Release][releases-shield]][releases]
[![License][license-shield]](LICENSE.md)
![Maintenance](https://img.shields.io/maintenance/yes/2022?style=for-the-badge)

# Support

Hey dude! Help me out for a couple of :beers: or a :coffee:!

[![coffee](https://www.buymeacoffee.com/assets/img/custom_images/black_img.png)](https://www.buymeacoffee.com/theOzzieRat)

If you like this card and would like to see me continue development of it a small donation would be greatly appreciated. I have already spent hundreds of hours working on this.

# Need Help?

If you need help the best place to ask is in the Home Assistant Community. There is a thread that can be found [here](https://community.home-assistant.io/t/platinum-weather-card-support/449166).

Alternativley create an issue on github, but note that only a couple of people will see that and may be busy doing other things.

# Overview

This is a fully customisable weather card with a graphical configuration. It has been patterned after the original Dark-Sky animated weather card (https://github.com/iammexx/home-assistant-config/tree/master/ui/darksky), and a forked variant, the BOM Weather Card (https://github.com/DavidFW1960/bom-weather-card). The aim is that this card is usable by people everywhere and be able to deal with your sensors no matter what integration(s) provides them. To get the most from the card you may need to look at what various weather integrations provide in addition to the standard weather entity.

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

## Overview Section

This section as the name suggests, adds an overview section to the card.

![Platinum Weather card](https://raw.githubusercontent.com/Makin-Things/platinum-weather-card/master/images/overview-section-highlighted.png)

There are 4 different layout options to choose from for the overview section. There are 'complete', 'observations', 'forecast' and 'title only'.

<caption>Complete</caption>

![Platinum Weather card](https://raw.githubusercontent.com/Makin-Things/platinum-weather-card/master/images/overview-section-complete.png 'Complete')

<caption>Observations</caption>

![Platinum Weather card](https://raw.githubusercontent.com/Makin-Things/platinum-weather-card/master/images/overview-section-observations.png 'Observations')

<caption>Forecast</caption>

![Platinum Weather card](https://raw.githubusercontent.com/Makin-Things/platinum-weather-card/master/images/overview-section-forecast.png 'Forecast')

<caption>Title Only</caption>

![Platinum Weather card](https://raw.githubusercontent.com/Makin-Things/platinum-weather-card/master/images/overview-section-title-only.png 'Title Only')

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

A section that shows todays detailed forecast. To use this section you will need a weather integration that provides a more detailed weather forecast (this does not exist within the standard weather.\* sensor). If it is not available for your location the best thing to do is to disable the extended section.

![Platinum Weather card](https://raw.githubusercontent.com/Makin-Things/platinum-weather-card/master/images/extended-section-highlighted.png)

The following fields are available.

| Option name                           | Type    | Description                                                                                                          |
| ------------------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------- |
| Entity Extended Forecast              | Entity  | The name of the entity that contains the detailed forecast                                                           |
| &nbsp;&nbsp;&nbsp;&nbsp;Use Attribute | Boolean | If this is enabled you will then be able to choose an attribute of the above entity to use for the detailed forecast |
| &nbsp;&nbsp;&nbsp;&nbsp;Attribute     | String  | The attribute that contains the detailed forecast                                                                    |
| Entity Today's UV Forecast            | String  | If defined the text from this entity will be appended to the detailed forecast                                       |
| Entity Today's Fire Danger            | String  | If defined the text from this entity will be appended to the detailed forecast                                       |

## Slots Section

A section to show a set of data in 2 columns (with up to 8 rows). This section is highly configurable. As you select different options for the slots the set of entities that are needed gets dynamically updated to indicate what options should be set.

![Platinum Weather card](https://raw.githubusercontent.com/Makin-Things/platinum-weather-card/master/images/slots-section-highlighted.png)

The following table describes what each slot value is intended to show. Note that what is available is very dependant on the weather integration in use.

| Slot Value                   | Description                                                                                           | Display Sample           |
| ---------------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------ |
| Current humidity             | Shows the current humidity as a percentage                                                            | 36%                      |
| Today's recorded rainfall    | The amount of rain that has fallen today                                                              | 5mm                      |
| Current air pressure         | The current atmopheric air pressure                                                                   | 1018hPa                  |
| Current wind conditions      | The current direction, speed and gust speed. If any element is missing it is removed from the display | SSE 9km/h (Gust 13km/h)  |
| Current wind conditions kts  | The current direction, speed and gust speed. If any element is missing it is removed from the display | SSE 5Kt (Gust 6Kt)       |
| Current visibility           | The current visibility. Most likely only available for airports                                       | 70km                     |
| Today's observed Max         | The maximum temperature recorded so far today                                                         | Observed Max 19°C        |
| Today's observed Min         | The minimum temperature recorded so far today                                                         | Observed Min 4°C         |
| Today's forecast Max         | The maximum temperature recorded so far today                                                         | Observed Max 19°C        |
| Today's forecast Min         | The minimum temperature recorded so far today                                                         | Observed Min 4°C         |
| Next temp min/max            | The next chronologically occuring minimum or maximum                                                  | Overnight Min 4°C        |
| Following temp min/max       | The following chronologically occuring minimum or maximum                                             | Tomorrow's Max 20°C      |
| Observed/forecast max        | Todays observer maximum and forecast maximums                                                         | Obs Max 19°C (Fore 19°C) |
| Observed/forecast min        | Todays observer maximum and forecast minimums                                                         | Obs Min 4°C (Fore 5°C)   |
| Next sun rise/set time       | The time of the next chronologically occuring sunrise or sunset                                       | 7:10pm                   |
| Following sun rise/set time  | The time of the following chronologically occuring sunrise or sunset                                  | Mon 6:35am               |
| Chance of rain               | The percentage chance of rain for today                                                               | 10%                      |
| Rainfall forecast            | A comination of the percentage chance of rain and the estimated amount                                | 10% - 3 to 6mm           |
| Today's forecast rainfall    | The estimated amount of rain today                                                                    | Forecast 3 to 6mm        |
| Tomorrow's forecast rainfall | The estimated amount of rain tomorrow                                                                 | Fore Tom 1 to 3mm        |
| Today's uv forecast          | The forecast maximum uv level for today                                                               | UV Extreme               |
| Today's fire danger          | The forecast fire danger for today                                                                    | Moderate                 |
| Custom entity 1              | Create a custom entity by specifying an icon, entity and unit                                         |                          |
| Custom entity 2              | Create a custom entity by specifying an icon, entity and unit                                         |                          |
| Custom entity 3              | Create a custom entity by specifying an icon, entity and unit                                         |                          |
| Custom entity 4              | Create a custom entity by specifying an icon, entity and unit                                         |                          |
| Blank slot                   | Show an empty slot                                                                                    |                          |
| Remove slot                  | Remove the slot. Any slot below will move up                                                          |                          |

## Daily Forecast Section

A section to show the daily forecast for a specified number of days in either a horizontal or vertical layout.

![Platinum Weather card](https://raw.githubusercontent.com/Makin-Things/platinum-weather-card/master/images/daily-forecast-section-highlighted.png)

There are two posible layouts.

<caption>Horizontal</caption>

![Platinum Weather card](https://raw.githubusercontent.com/Makin-Things/platinum-weather-card/master/images/daily-forecast-section-horizontal.png 'Horizontal')

<caption>Vertical</caption>

![Platinum Weather card](https://raw.githubusercontent.com/Makin-Things/platinum-weather-card/master/images/daily-forecast-section-vertical.png 'Vertical')

The following fields are available.

| Option name                           | Type    | Description                                                                                                          |
| ------------------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------- |
| Entity Forecast Icon 1                | String  | The entity that provides the description of which icon to use                                                        |
| Entity Forecast Summary 1             | String  | The entity that provides the short summary text                                                                      |
| Entity Forecast Min 1                 | String  | The entity that provides the forecast minimum temperature                                                            |
| Entity Forecast Max 1                 | String  | The entity that provides the forecast maximum temperature                                                            |
| Entity Forecast Chance of Rain 1      | String  | The entity that provides the percentage chance of rain                                                               |
| Entity Forecast Possible Rain 1       | String  | The entity that provide the estimated amount of rain                                                                 |
| Entity Extended Forecast 1            | String  | The name of the entity that contains the detailed forecast                                                           |
| &nbsp;&nbsp;&nbsp;&nbsp;Use Attribute | Boolean | If this is enabled you will then be able to choose an attribute of the above entity to use for the detailed forecast |
| &nbsp;&nbsp;&nbsp;&nbsp;Attribute     | String  | The attribute that contains the detailed forecast                                                                    |
| Entity Fire Danger 1                  | String  | The entity that provides the fire danger forecast                                                                    |

For these entities you can either specify a weather.\* sensor (except for extended forecasts and fire danger as they aren't included in weather integrations) in which case it will use the data from the attributes, or you can use individual sensors and provide the name of the sensor for tomorrow (these sensors must have an incrementing number in their name).

## Global options

This page contains options that don't neatly fit in other places (ie. they have an effect on multiple sections).

![Platinum Weather card](https://raw.githubusercontent.com/Makin-Things/platinum-weather-card/master/images/global-options.png)

The following fields are available.

| Option name      | Type    | Description                                                                        |
| ---------------- | ------- | ---------------------------------------------------------------------------------- |
| Show staic icons | Boolean | Turning this on disables the use of animated icons across the entire card          |
| Time format      | String  | Selects whether to use the system time format or explicitly set 12 or 24 hour mode |
| Locale           | String  | Specifies a locale to pass into any conversion functions                           |

# Migration from the old card

Migration from the older [Custom Animated Weather Card](https://github.com/DavidFW1960/bom-weather-card) is straight forward. It is recommended that you create a new card rather so that your current cards config is preserved until you are happy with the new cards configuration.

Create a new Platinum Weather Card, switch to the Code Editor (YAML mode) and simply paste in the contents of your existing configuration, making sure to keep the new `type: custom:platinum-weather-card`. At this stage some elements may not appear correctly. Save the card and then edit it again (the editor updates the configuration when opened if it detects an older config and performs some update tasks) and then save it once more.

If there are still items that don't look correct you will need to manually adjust those to suit.

# YAML Reference

This reference is here for completeness. All settings can be configured using the GUI so you should not need to refer to this. The options are split into global settings and a section for each of the sections in the card.

## Global Settings

| Variable                    | Type    | Default                                                         | Description                                                         |
| --------------------------- | ------- | --------------------------------------------------------------- | ------------------------------------------------------------------- |
| type                        | String  | null                                                            | Must be `custom:platinum-weather-card`                              |
| section_order               | List    | `- overview`<br>`- extended`<br>`- slots`<br>`- daily_forecast` | Specifies the order in which the sections are displayed on the card |
| show_section_overview       | Boolean | `true`                                                          | Specifies if the overview section is visible                        |
| show_section_extended       | Boolean | `true`                                                          | Specifies if the extended section is visible                        |
| show_section_slots          | Boolean | `true`                                                          | Specifies if the slots section is visible                           |
| show_section_daily_forecast | Boolean | `true`                                                          | Specifies if the daily_forecast section is visible                  |
| tap_action                  | Action  | none                                                            | Specifies what action to perform when the card is tapped            |
| hold_action                 | Action  | none                                                            | Specifies what action to perform when the card is held              |
| option_static_icons         | Boolean | false                                                           | Set to true to use non-animated icons                               |
| option_time_format          | String  | `system`                                                        | Can be one of `system`, `12hour` or `24hour`                        |
| option_locale               | String  | none                                                            | The locale to use when formatting timestamps                        |
| text_update_time_prefix     | String  | none                                                            | Specifies a string to prepend to the update time                    |

## Overview Settings

| Variable                       | Type    | Default    | Description                                                                                                             |
| ------------------------------ | ------- | ---------- | ----------------------------------------------------------------------------------------------------------------------- |
| overview_layout                | String  | `complete` | Can be one of `complete`, `observations`, `forecast` or `title only`. Sets the layout to use for the overview section   |
| option_show_overview_decimals  | Boolean | `false`    | Show one decimal place on current and apparent temperature                                                              |
| option_show_overview_separator | Boolean | `false`    | Show separator at bottom of overview section                                                                            |
| text_card_title                | String  | none       | Line 1 of the cards title                                                                                               |
| text_card_title_2              | String  | none       | Line 2 of the cards title                                                                                               |
| entity_update_time             | String  | none       | The name of the entity that provides the update time. It uses the entity's state unless ``update_time_use_attr` is true |
| update_time_use_attr           | Boolean | `false`    | The name of the attribute that provides the update time                                                                 |
| update_time_name_attr          | String  | none       | The name of the attribute to use for the update time                                                                    |
| entity_temperature             | String  | none       | The name of the entity that provides the current temperature                                                            |
| entity_apparent_temp           | String  | none       | The name of the entity that provides the apparent (feels like) temperature                                              |
| entity_forecast_icon           | String  | none       | The name of the entity that provides todays forecast icon                                                               |
| entity_summary                 | String  | none       | The name of the entity that provides the short forecast summary                                                         |

## Extended Section

| Variable                  | Type    | Default | Description                                                                                 |
| ------------------------- | ------- | ------- | ------------------------------------------------------------------------------------------- |
| entity_extended           | String  | none    | The name of the entity that provides today's extended forecast                              |
| extended_use_attr         | Boolean | `false` | The name of the attribute that provides the extended forecast                               |
| extended_name_attr        | String  | none    | The name of the attribute to use for the extended forecast                                  |
| entity_todays_uv_forecast | String  | none    | The name of the entity that provides today's uv forecast to append to the extended forecast |
| entity_todays_fire_danger | String  | none    | The name of the entity that provides today's fire danger to append to the extended forecast |

## Slots Section

| Variable                          | Type    | Default         | Description                                                      |
| --------------------------------- | ------- | --------------- | ---------------------------------------------------------------- |
| slot_l1                           | Slot    | `forecast_max`  | The value to show in slot l1. See table below for more detail    |
| slot_l2                           | Slot    | `forecast_min`  | The value to show in slot l2. See table below for more detail    |
| slot_l3                           | Slot    | `wind`          | The value to show in slot l3. See table below for more detail    |
| slot_l4                           | Slot    | `pressure`      | The value to show in slot l4. See table below for more detail    |
| slot_l5                           | Slot    | `sun_next`      | The value to show in slot l5. See table below for more detail    |
| slot_l6                           | Slot    | `remove`        | The value to show in slot l6. See table below for more detail    |
| slot_l7                           | Slot    | `remove`        | The value to show in slot l7. See table below for more detail    |
| slot_l8                           | Slot    | `remove`        | The value to show in slot l8. See table below for more detail    |
| slot_r1                           | Slot    | `popforecast`   | The value to show in slot r1. See table below for more detail    |
| slot_r2                           | Slot    | `humidity`      | The value to show in slot r2. See table below for more detail    |
| slot_r3                           | Slot    | `uv_summary`    | The value to show in slot r3. See table below for more detail    |
| slot_r4                           | Slot    | `fire_danger`   | The value to show in slot r4. See table below for more detail    |
| slot_r5                           | Slot    | `sun_following` | The value to show in slot r5. See table below for more detail    |
| slot_r6                           | Slot    | `remove`        | The value to show in slot r6. See table below for more detail    |
| slot_r7                           | Slot    | `remove`        | The value to show in slot r7. See table below for more detail    |
| slot_r8                           | Slot    | `remove`        | The value to show in slot r8. See table below for more detail    |
| entity_pop                        | String  | none            | Entity required for `pop` and `popforecast`                      |
| entity_pos                        | String  | none            | Entity required for `popforecast` and `possible_today`           |
| entity_possible_tomorrow          | String  | none            | Entity required for `possible_tomorrow`                          |
| entity_rainfall                   | String  | none            | Entity required for `rainfall`                                   |
| entity_humidity                   | String  | none            | Entity required for `humidity`                                   |
| entity_pressure                   | String  | none            | Entity required for `pressure`                                   |
| entity_observed_max               | String  | none            | Entity required for `observed_max` and `temp_maximums`           |
| entity_observed_min               | String  | none            | Entity required for `observed_min` and `temp_minimums`           |
| entity_forecast_max               | String  | none            | Entity required for `forecast_max` and `temp_maximums`           |
| entity_forecast_min               | String  | none            | Entity required for `forecast_min` and `temp_minimums`           |
| entity_temp_next                  | String  | none            | Entity required for `temp_next`                                  |
| entity_temp_next_label            | String  | none            | Entity required for `temp_next`                                  |
| entity_temp_following             | String  | none            | Entity required for `temp_following`                             |
| entity_temp_following_label       | String  | none            | Entity required for `temp_following`                             |
| entity_uv_alert_summary           | String  | none            | Entity required for `uv_summary`                                 |
| entity_fire_danger                | String  | none            | Entity required for `fire_danger`                                |
| entity_wind_bearing               | String  | none            | Entity required for `wind` and `wind_kt`                         |
| entity_wind_speed                 | String  | none            | Entity required for `wind`                                       |
| entity_wind_gust                  | String  | none            | Entity required for `wind`                                       |
| entity_wind_gust_kt               | String  | none            | Entity required for `wind_kt`                                    |
| entity_wind_speed_kt              | String  | none            | Entity required for `wind_kt`                                    |
| entity_visibility                 | String  | none            | Entity required for `visibility`                                 |
| entity_sun                        | String  | none            | Entity required for `sun_next` and `sun_following`               |
| custom1_value                     | String  | none            | Entity required for `custom1`                                    |
| custom1_icon                      | Icon    | none            | Name of mdi icon to use for `custom1`                            |
| custom1_units                     | String  | none            | Units to display for `custom1`                                   |
| custom2_value                     | String  | none            | Entity required for `custom2`                                    |
| custom2_icon                      | Icon    | none            | Name of mdi icon to use for `custom2`                            |
| custom2_units                     | String  | none            | Units to display for `custom2`                                   |
| custom3_value                     | String  | none            | Entity required for `custom3`                                    |
| custom3_icon                      | Icon    | none            | Name of mdi icon to use for `custom3`                            |
| custom3_units                     | String  | none            | Units to display for `custom3`                                   |
| custom4_value                     | String  | none            | Entity required for `custom4`                                    |
| custom4_icon                      | Icon    | none            | Name of mdi icon to use for `custom4`                            |
| custom4_units                     | String  | none            | Units to display for `custom4`                                   |
| option_today_temperature_decimals | Boolean | `false`         | Show one decimal place for temperature slots                     |
| option_today_rainfall_decimals    | Boolean | `false`         | Show one decimal place for rainfall slots                        |
| option_pressure_decimals          | Number  | `0`             | Number of decimals to show for air pressure `0`, `1`, `2` or `3` |
| option_color_fire_danger          | Boolean | `true`          | Use color attributes from fire danger if set                     |

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
| daily_forecast_layout          | String  | `horizontal` | Format for layout `horizontal` or `vertical`                               |
| daily_forecast_days            | Number  | `5`          | Number of days to include in forecast. `horizontal (1-5)` `vertical (1-7)` |
| option_tooltips                | Boolean | `false`      | Show forecast tooltips on horizontal forecast                              |
| daily_extended_forecast_days   | Number  | `7`          | Show extended forecast. (only for vertical forecast `(1-7)`)               |
| option_daily_color_fire_danger | Boolean | `true`       | Use color attributes from fire danger if set (oly for vertical forecast)   |

[license-shield]: https://img.shields.io/github/license/makin-things/platinum-weather-card.svg?style=for-the-badge
[releases-shield]: https://img.shields.io/github/release/makin-things/platinum-weather-card.svg?style=for-the-badge
[releases]: https://github.com/makin-things/platinum-weather-card/releases
