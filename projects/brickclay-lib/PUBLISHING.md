# Publishing Minahil Library

This guide covers how to publish the Minahil library to npm with the ng-add schematic support.

## Pre-Publishing Checklist

Before publishing, ensure:

- ✅ All tests pass
- ✅ Version number is updated in `projects/brickclay-lib/package.json`
- ✅ CHANGELOG is updated (if you maintain one)
- ✅ Build completes successfully

## Build Process

The build process has three steps:

```bash
npm run build
```

This runs:

1. `build:schematics` - Compiles TypeScript schematics to JavaScript
2. `ng build` - Builds the Angular library
3. `build:copy-schematics` - Copies schematics and updates package.json

## Verify Build Output

Check that the dist folder has all required files:

```bash
cd dist/brickclay-lib
```

Verify these files exist:

- ✅ `package.json` (with `schematics` field)
- ✅ `schematics/collection.json`
- ✅ `schematics/ng-add/index.js`
- ✅ `schematics/ng-add/schema.json`

Check package.json contains:

```json
{
  "schematics": "./schematics/collection.json",
  "ng-add": {
    "save": "dependencies"
  }
}
```

## Publishing to npm

### 1. Login to npm

```bash
npm login
```

### 2. Navigate to dist folder

```bash
cd dist/brickclay-lib
```

### 3. Publish

For first-time publishing:

```bash
npm publish --access public
```

For updates:

```bash
npm publish
```

### 4. Verify on npm

Visit: https://www.npmjs.com/package/minahil

Check:

- ✅ Latest version is shown
- ✅ Files tab shows `schematics/` folder

## Testing After Publishing

### Local Test (Before Publishing)

1. **Build the library:**

   ```bash
   npm run build
   ```

2. **Link locally:**

   ```bash
   cd dist/brickclay-lib
   npm link
   ```

3. **Create test project:**

   ```bash
   cd ../../..
   mkdir test-project
   cd test-project
   ng new test-app
   cd test-app
   ```

4. **Link and test:**

   ```bash
   npm link minahil
   ng add minahil
   ```

5. **Cleanup:**
   ```bash
   npm unlink minahil
   cd ../../../dist/brickclay-lib
   npm unlink
   ```

### Production Test (After Publishing)

1. **Create fresh test project:**

   ```bash
   ng new fresh-test
   cd fresh-test
   ```

2. **Test ng add:**

   ```bash
   ng add minahil
   ```

3. **Verify installation:**
   - Check `package.json` has `minahil`, `@angular/cdk`, and `moment`
   - Check CDK version matches Angular version
   - Test importing components

## Version Management

### Updating Version

Edit `projects/brickclay-lib/package.json`:

```json
{
  "version": "0.1.8"
}
```

Then rebuild and publish:

```bash
npm run build
cd dist/brickclay-lib
npm publish
```

### Version Numbering

Follow semantic versioning:

- **Patch** (0.1.8 → 0.1.9): Bug fixes, no breaking changes
- **Minor** (0.1.9 → 0.2.0): New features, backward compatible
- **Major** (0.2.0 → 1.0.0): Breaking changes

## Troubleshooting

### "Package does not support schematics"

**Problem:** The schematics files aren't in the published package.

**Solution:**

1. Ensure you ran `npm run build` (not just `ng build`)
2. Check `dist/brickclay-lib/schematics/` folder exists
3. Verify `dist/brickclay-lib/package.json` has `"schematics"` field

### "Cannot find module @angular-devkit/schematics"

**Problem:** User's environment doesn't have the schematics package.

**Solution:** This should auto-install with Angular CLI. User should update their CLI:

```bash
npm install -g @angular/cli@latest
```

### Wrong CDK version installed

**Problem:** CDK doesn't match Angular version.

**Solution:**

1. Check the schematic logic in `schematics/ng-add/index.ts`
2. Verify peer dependencies in `projects/brickclay-lib/package.json`
3. Test with: `ng add minahil --verbose`

## Common Commands

```bash
# Build
npm run build

# Build only schematics
npm run build:schematics

# Publish (from dist folder)
cd dist/brickclay-lib && npm publish

# Test locally
npm run build && cd dist/brickclay-lib && npm link

# View published package info
npm view minahil

# Unpublish a version (within 72 hours)
npm unpublish minahil@0.1.7
```

## Best Practices

1. ✅ Always test locally before publishing
2. ✅ Update version number before each publish
3. ✅ Test with multiple Angular versions (17, 19, 21)
4. ✅ Document breaking changes
5. ✅ Keep peer dependencies up to date
6. ✅ Test ng-add in a fresh project

## Support

If users encounter issues:

1. Check their Angular version: `ng version`
2. Verify they have latest CLI: `npm install -g @angular/cli@latest`
3. Clear npm cache: `npm cache clean --force`
4. Try fresh install: Delete `node_modules` and `package-lock.json`, then `npm install`
