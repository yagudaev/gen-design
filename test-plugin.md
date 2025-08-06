# Testing the Gen Design AI Plugin

## Prerequisites

1. Ensure all dependencies are installed:
   ```bash
   yarn install
   ```

2. Start the API server:
   ```bash
   cd website && yarn dev
   ```

3. Build the plugin:
   ```bash
   cd plugin && yarn build
   ```

## Installation in Figma

1. Open Figma Desktop App
2. Create a new design file or open an existing one
3. Go to Menu → Plugins → Development → Import plugin from manifest
4. Navigate to `gen-design/plugin/` directory
5. Select the `manifest.json` file
6. The plugin "Gen Design AI" should now appear in your plugins menu

## Testing Checklist

### Basic Functionality

- [ ] Plugin loads without errors
- [ ] UI displays correctly at 400x600 pixels
- [ ] Settings panel toggles on/off
- [ ] Chat interface is responsive

### Design System Detection

- [ ] Local components are detected and listed
- [ ] Component count is accurate
- [ ] Design system dropdown populates

### Generation Features

- [ ] Text input accepts prompts
- [ ] Send button triggers generation
- [ ] Loading state displays during generation
- [ ] Error messages display appropriately

### Test Prompts

Try these prompts to test different features:

1. **Simple Component**: "Create a button with primary style"
2. **Login Screen**: "Design a login screen with email and password fields"
3. **Card Component**: "Create a product card with image, title, and price"
4. **Dashboard**: "Design a simple analytics dashboard"
5. **Mobile Screen**: "Create a mobile home screen with bottom navigation"

### Variant Generation

- [ ] Slider adjusts variant count (1-6)
- [ ] Multiple variants are generated side by side
- [ ] Each variant has unique positioning

### Options Testing

- [ ] Responsive option creates desktop version
- [ ] Edge cases option creates error/empty states
- [ ] Multi-screen option creates connected flows

### API Integration

- [ ] API calls work with localhost:3000
- [ ] CORS headers allow plugin communication
- [ ] Fallback generation works if API is down

### Error Handling

- [ ] Network errors display user-friendly messages
- [ ] Invalid inputs are handled gracefully
- [ ] Plugin doesn't crash on errors

## Debugging

### View Console Logs

1. In Figma, use Cmd+Option+I (Mac) or Ctrl+Shift+I (Windows)
2. Or search "Show/Hide Console" in Quick Actions

### Common Issues

**Plugin won't load:**
- Check manifest.json is valid
- Ensure build completed successfully
- Restart Figma if needed

**API connection fails:**
- Verify website server is running on port 3000
- Check CORS configuration in next.config.js
- Look for network errors in console

**Generation doesn't work:**
- Check API keys are configured in .env
- Verify OpenRouter API key is valid
- Check console for specific error messages

**UI issues:**
- Clear Figma cache and reload
- Check CSS compilation in build
- Verify all styles are applied

## Performance Testing

1. Generate multiple designs in succession
2. Test with large design systems (50+ components)
3. Generate all variants with all options enabled
4. Check memory usage in developer console

## Edge Cases to Test

1. Empty design file (no components)
2. Very long prompts (500+ characters)
3. Special characters in prompts
4. Rapid successive generations
5. Switching between design systems quickly

## Reporting Issues

When reporting issues, include:
1. Figma version
2. Plugin version (from manifest.json)
3. Console error messages
4. Steps to reproduce
5. Screenshots if UI-related