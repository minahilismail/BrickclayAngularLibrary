# How Optional Peer Dependencies Solve the ng-add Problem

## The Problem

When users ran `ng add minahil` with Angular 19 installed, they got this error:

```
npm error Could not resolve dependency:
npm error peer @angular/common@"^21.0.0 || ^22.0.0" from @angular/cdk@21.1.4
```

**Why did this happen?**

The `ng add` command works in this order:

1. **Install the package** (minahil) + resolve peer dependencies
2. **Run the schematic** (our ng-add code)

When npm tried to install minahil, it saw:

```json
"peerDependencies": {
  "@angular/cdk": ">=17.0.0 <22.0.0"
}
```

npm said: "OK, I'll install the LATEST version that matches: `@angular/cdk@21.1.4`"

But then `@angular/cdk@21.1.4` requires Angular 21 or 22, and the user has Angular 19. ❌ CONFLICT!

The schematic never got a chance to run because the package installation failed first.

## The Solution: Optional Peer Dependencies

We added `peerDependenciesMeta` to mark CDK and moment as **optional**:

```json
{
  "peerDependencies": {
    "@angular/cdk": ">=17.0.0 <22.0.0",
    "@angular/common": ">=17.0.0 <22.0.0",
    "@angular/core": ">=17.0.0 <22.0.0",
    "moment": "^2.29.0"
  },
  "peerDependenciesMeta": {
    "@angular/cdk": {
      "optional": true
    },
    "moment": {
      "optional": true
    }
  }
}
```

### What Does "optional" Mean?

When a peer dependency is marked as optional:

- ✅ npm will NOT automatically install it
- ✅ npm will NOT error if it's missing or has version conflicts
- ⚠️ npm will still WARN if it's missing (which is good!)
- ✅ Our schematic can install it with the correct version

## How It Works Now

### Step-by-Step Flow

1. **User runs:** `ng add minahil`

2. **npm installs minahil:**
   - Sees `@angular/cdk` is a peer dependency
   - Sees `@angular/cdk` is marked as **optional**
   - **Skips installing CDK** ✅
   - Successfully installs minahil

3. **ng CLI runs the schematic:**
   - Schematic reads `package.json`
   - Detects Angular version: 19
   - Installs `@angular/cdk@^19.0.0` ✅
   - Installs `moment@^2.29.0` ✅

4. **Success!** 🎉

### Example Output

```bash
ng add minahil

✔ Determining Package Manager
  › Using package manager: npm
✔ Searching for compatible package version
  › Found compatible package version: minahil@0.1.11
✔ Loading package information from registry
✔ Installing package
✔ Package successfully installed
🚀 Setting up Minahil library...
✅ Detected Angular version: 19
✅ Installing @angular/cdk@^19.0.0 to match Angular 19
✅ Installing moment@^2.29.0
🎉 Minahil library has been successfully configured!
```

## Why Angular Material Doesn't Need This

Angular Material publishes **separate versions** for each Angular version:

- `@angular/material@17.x.x` requires Angular 17 and CDK 17
- `@angular/material@19.x.x` requires Angular 19 and CDK 19
- `@angular/material@21.x.x` requires Angular 21 and CDK 21

When you run `ng add @angular/material` in an Angular 19 project, the CLI automatically installs Material 19, which has:

```json
{
  "peerDependencies": {
    "@angular/cdk": "19.x.x", // Exact version match
    "@angular/core": "^19.0.0"
  }
}
```

**But we don't want to maintain separate versions!** We want ONE library that works with Angular 17-21.

## Comparison: Different Approaches

### Approach 1: Multiple Versions (Angular Material's Way)

```
minahil@17.x.x → Requires Angular 17, CDK 17
minahil@19.x.x → Requires Angular 19, CDK 19
minahil@21.x.x → Requires Angular 21, CDK 21
```

**Pros:**

- No peer dependency conflicts
- npm automatically installs matching versions

**Cons:**

- ❌ Must maintain separate codebases or build variants
- ❌ Must publish 3+ versions for each release
- ❌ Users must remember to use matching versions

### Approach 2: Wide Range + Schematic (Our Way)

```
minahil@1.x.x → Works with Angular 17-21
```

**Pros:**

- ✅ Single codebase
- ✅ Single version to publish
- ✅ Works automatically with ng-add
- ✅ Users don't need to worry about versions

**Cons:**

- Requires schematic to install correct CDK version
- Requires optional peer dependencies

## Key Takeaways

1. **peerDependenciesMeta with optional: true** tells npm to NOT auto-install these dependencies

2. **The schematic takes over** and installs the correct versions based on the user's Angular version

3. **This allows ONE library version** to support multiple Angular versions (17-21)

4. **Users get automatic, correct installation** with `ng add minahil`

## Files Changed

1. **projects/brickclay-lib/package.json**
   - Added `peerDependenciesMeta`

2. **scripts/copy-schematics.js**
   - Updates dist package.json with `peerDependenciesMeta`

## Testing

After building with `npm run build`, verify:

```bash
# Check dist/package.json has peerDependenciesMeta
cat dist/brickclay-lib/package.json | grep -A 5 peerDependenciesMeta

# Should show:
# "peerDependenciesMeta": {
#   "@angular/cdk": {
#     "optional": true
#   },
#   "moment": {
#     "optional": true
#   }
# }
```

## Publishing

When you publish the next version:

```bash
# Increment version first
npm run build
cd dist/brickclay-lib
npm publish
```

Users with Angular 19 can now successfully run:

```bash
ng add minahil
```

And it will install the correct CDK 19 version! 🎉
