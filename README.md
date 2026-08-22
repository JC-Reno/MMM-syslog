# MMM-syslog

Notification API Module for MagicMirror^2

## Example

![MMM-syslog example](https://forum.magicmirror.builders/uploads/files/1473753516823-syslog-icon-4.jpg)

## Dependencies

* An installation of [MagicMirror^2](https://github.com/MichMich/MagicMirror)

## Installation

1. Clone this repo into `~/MagicMirror/modules` directory.
2. Configure your `~/MagicMirror/config/config.js`:

```js
{
  module: 'MMM-syslog',
  position: 'top_right',
  config: {
    ...
  }
}
```

## Config Options

| **Option** | **Default** | **Description** |
| --- | --- | --- |
| `max` | `20` | How many messages should be displayed on the screen. |
| `title` | `"Notifications"` | Module header text. Set to `false` to hide it. |
| `format` | `false` | Displays relative date format, for absolute date format provide a string like `'DD:MM HH:mm'` [All Options](http://momentjs.com/docs/#/displaying/format/) |
| `error_color` | `"yellow"` | Text/icon color for `ERROR` messages. |
| `warning_color` | `"cyan"` | Text/icon color for `WARNING` messages. |
| `info_color` | `"green"` | Text/icon color for `INFO` messages. |
| `types` | `{INFO: "dimmed", WARNING: "normal", ERROR: "bright"}` | Object with message types and their css class. |
| `customEvents` | `[]` | Overrides icon/color when a keyword appears in the payload text. |
| `shortenMessage` | `false` | After how many characters the message should be cut. Default: show all. |
| `alert` | `true` | Display notification? |

### Example Configuration

```js
{
  module: 'MMM-syslog',
  position: 'top_right',
  config: {
    max: 20, // messages displayed
    title: "Notifications",
    error_color: "yellow", // yellow text
    warning_color: "cyan", // cyan text
    info_color: "green", // green text
    customEvents: [
      { keyword: "Birthday", symbol: "birthday-cake", color: "white" },
      { keyword: "Recycle", symbol: "recycle", color: "cyan" },
      { keyword: "Water", symbol: "tint", color: "aqua" },
      { keyword: "Trash", symbol: "trash", color: "lime" }
    ]
  }
}
```

`customEvents` checks each incoming payload message and when a `keyword` is found, it overrides the icon (`symbol`) and text/icon `color` for that row.

## Icons

Icon descriptions can be found at: [Font Awesome v4.7 Icons](https://fontawesome.com/v4.7/icons/)

This module renders icons using the Font Awesome stylesheet (`font-awesome.css`).
If you include emoji characters in `message`, your system emoji font (for example AppleColorEmoji.ttf on macOS) is used to render those characters.

## How to Use

Make an http get request like:

`http://MIRROR_IP:MIRROR_PORT/syslog?type=INFO&message=YOUR_MESSAGE&silent=true` : no notification
