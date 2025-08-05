# Overview

We are building a tool for designers to create designs in figma using text, image input or selected frame in figma canvas. It should respect the existing design system (pull libraries from the org/team).

# Tech stack

- Figma plugin SDK
- React
- TypeScript
- Create-Figma-Plugin https://yuanqing.github.io/create-figma-plugin/
- Mono repo with the following folders website/ and plugin/ where the plugin is the figma plugin and the website is the api server
- Claude Opus 4.1 (Antropic API) - main model but addiontal models will be available like OpenAI, Kimi K2, etc.
- OpenRouter to do the model selection and routing

# Top level requirements

It should help us with the following

1. First draft / empty page
2. I need 3 variants for each design
3. Edge cases - error states, empty states
4. Responsive design - mobile vs desktop
5. Create figma flows (multiple-screens connected)

# Functional requirements

* Show all the design systems based on the libraries the user has access to
* Let the user select the design system from a dropdown
* Use a standard chat interface, draw inspiration from ChatGPT
* Dropdown to select the model Claude Opus, Claude Sonnet, OpenAI APIs
* Allow user to edit the system prompt in a settings area ("I'm a designer that works for XYZ, I am expected to do ABC")

# Generation requirements

* Determine if the user prompt requires a single screen or multiple screens
* If multiple screens, always put the frames into a figma section and label things
* If a frame is selected, it should analyze the children and find any components there and pass that as context to the LLM
* If you cannot find any component that matches the task in the design system, try extending the design system using the design tokens and language that already exists
