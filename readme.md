# About Heimeyra

**_heimeyra_ loosely means "home of listening" in Old Norse.** According to legend, Heimdall could hear grass grow...but heimdall.app was taken. heimerya was built by audiobook narrator and voice actor [Magnus Carlssen](https://magnuscarlssen.substack.com/).

I live near a small university flight school, and am frequently interrupted during recording sessions by trainers buzzing my studio. To avoid losing a perfect take, I use public aircraft tracking data to watch out for incoming aircraft.

The [first generation of this app](https://github.com/mcarlssen/code/tree/main/plane-tracker) in 2023 was a simple Powershell script. I rebuilt it as a webapp in the fall of 2024 to teach myself Typescript, React, and Cursor.

If you find it useful, or want to commiserate about the joys of recording audiobooks near an airfield (looking at you, Duffy), join us in the [Audiobook Producers Discord](https://dsc.gg/narrators). We're a friendly, quiet bunch, and don't much like airplanes.

[![Support on Ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/U7U24513O)

# Help

### Getting Started
- 🌎 **Move the map around to select a location**.

- ⭕ **Set the 'Radius' slider to the _distance where you start to hear an aircraft._**
  > Some trial and error may be needed to figure out the proper distance.

- 🚦 Mouse over the stoplight to see the current radius stages based on your settings.

- ☁️ Use the 'Max Altitude' slider to filter out high-flying aircraft that are inaudible anyway.

- ⌛ The default update frequency is 5 seconds. Adjust to your needs.

### Troubleshooting
- ☠️ **If it all goes sideways, or the list isn't updating, shift+reload the page.**

- 🐛 If unpausing does nothing, check the browser console for new data logs, and see above.

- 🪲 [Report new bugs](https://github.com/mcarlssen/heimeyra/issues), please and thank you!

### Changelog
v1.0.0 - Alpha Release - Nov 2, 2024
• Interactive map to choose location
• Customizable radius, altitude, and update frequency filters
• Stepped warning levels 
• Detachable warning indicator

# known issues
• sometimes unpausing does nothing. refresh page to reset.