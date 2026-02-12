# Testing ng-add Schematic Locally

Follow these steps to test the `ng add minahil` command locally:

## 1. Build the Library

```bash
npm run build
```

This will:

- Compile the schematics TypeScript files
- Build the library with ng-packagr
- Copy the schematic files to the dist folder

## 2. Link the Library Locally

Navigate to the dist folder and create a local npm link:

```bash
cd dist/brickclay-lib
npm link
```

## 3. Create a Test Angular Project

Create a new test project (use a different directory):

```bash
cd ..
cd ..
ng new test-app --routing=false --style=css
cd test-app
```

## 4. Install Angular CDK (Optional Test)

For testing purposes, you can either:

**Option A: Let ng-add install CDK automatically**

```bash
# Just run ng add - it should install matching CDK
ng add minahil
```

**Option B: Pre-install CDK to test version detection**

```bash
# Install a specific Angular version first
npm install @angular/core@19.0.0 @angular/common@19.0.0
# Then run ng add
ng add minahil
```

## 5. Test Different Angular Versions

To test with different Angular versions:

```bash
# Angular 17
npm install @angular/core@^17.0.0 @angular/common@^17.0.0
ng add minahil

# Angular 18
npm install @angular/core@^18.0.0 @angular/common@^18.0.0
ng add minahil

# Angular 19
npm install @angular/core@^19.0.0 @angular/common@^19.0.0
ng add minahil
```

## 6. Verify Installation

After running `ng add minahil`, check:

1. **package.json** should contain:
   - `minahil`
   - `@angular/cdk` (matching version)
   - `moment`

2. **Console output** should show:
   - Detected Angular version
   - Installing matching CDK version
   - Success message

## 7. Cleanup

When done testing:

```bash
# In the test project
npm unlink minahil

# In the library dist folder
cd ../../dist/brickclay-lib
npm unlink
```

## Expected Behavior

- ✅ Angular 17 project → installs `@angular/cdk@^17.0.0`
- ✅ Angular 19 project → installs `@angular/cdk@^19.0.0`
- ✅ Angular 21 project → installs `@angular/cdk@^21.0.0`
- ❌ Angular 16 or 22+ → shows error message about unsupported version

## Troubleshooting

**Issue: "Cannot find module @angular-devkit/schematics"**

- Make sure you ran `npm install` in the root workspace

**Issue: Schematic files not in dist folder**

- Check that `ng-package.json` includes the schematics assets
- Rebuild: `npm run build`

**Issue: ng add doesn't run the schematic**

- Verify `package.json` has the `"schematics"` and `"ng-add"` fields
- Check that `collection.json` exists in dist folder
