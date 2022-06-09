## Options in use

| Name                      | Type    | Requirement  | Description                                                      | Default       |
| ------------------------- | ------- | ------------ | ---------------------------------------------------------------- | ------------- |
| entity_current_conditions | string  | **Optional** | entity for the icon                                              | **Undefined** |
| entity_temperature        | string  | **Optional** | entity for the current temperature                               | **Undefined** |
| entity_apparent_temp      | string  | **Optional** | entity for the 'feels like' temperature                          | **Undefined** |
| entity_current_text       | string  | **Optional** | entity for the short forecast                                    | **Undefined** |
| static_icons              | boolean | **Optional** | use static or animated icons                                     | `false`       |
| old_icon                  | string  | **Optional** | ????                                                             | 'true'?       |
| entity_sun                | string  | **Optional** | The entity to use to determine day/night icons                   | `sun.sun`     |
| show_decimals             | boolean | **Optional** | Whether to show one decimal place on current temp and feels like | `false`       |
| entity_pressure           | string  | **Optional** | entiry for the current barometric pressure                       | **Undefined** |
| temp_font_weight          | number  | **Optional** | the font weight for the curretn temperature display              | `300`         |
| temp_font_size            | string  | **Optional** | the font size for the current temperature display                | `4em`         |
| current_text_font_size    | string  | **Optional** | the font size for the short forecast text                        | `1.5em`       |
| current_text_alignment    | string  | **Optional** | horizontal alignment for the short forecast text                 | `center`      |
