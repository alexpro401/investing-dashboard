# Localization usage guide

## Introduction

Localization in this project realized by [i18next](https://www.i18next.com/) and [react-i18n](https://react.i18next.com/).

It can be used in components with useTranslation hook or in any other file with importing i18n instance.

## How to use in components || hooks

```tsx
import React from 'react';

// the hook
import { useTranslation } from 'react-i18next';

function MyComponent () {
  const { t } = useTranslation();
  return <h1>{ t('my-component.title') }</h1>
}
```

## How to use in other non-functional component || hook files

```ts
import { PoolType } from "consts"
import i18n from "localization"

export const localizePoolType = (poolType?: PoolType) => {
  if (!poolType) return ""

  return {
    ALL_POOL: i18n.t("filters.pool-type.all-pool"),
    INVEST_POOL: i18n.t("filters.pool-type.invest-pool"),
    BASIC_POOL: i18n.t("filters.pool-type.basic-pool"),
  }[poolType]
}

```


## Rules to follow

1. All keys should be in kebab case
2. If you create a new localization key in component file - first of all, it should be started with file name in kebab-case, perfectly - one component per file
3. If you create a new localization key in other files as like as class methods or functions - if you localize something global, create file with function in src/localization/helpers as like as [localizePoolType](./helpers/localizePoolType.ts)
4. Created key you should define in [resources](./resources) with each language files e.g. if you have en.json and ua.json files - you should define key in both files
5. In localization json file already defined a few structures:
   6. validations - [for form validation messages](../utils/validators.ts)
   7. errors - for defined errors (_coming soon_)
   8. filters - for global enums|consts aka statuses/states/pool types/etc... (comming soon)
   9. notifications - for default notification messages(_coming soon_)
10. Try not to specify a key too unique translation e.g. if you have a place with text "Some Great Title" - do not create a key:

```json
{
  "my-component": {
    "some-great-title": "Some Great Title"
  }
}
```
instead, try to create more abstract key, depends on page/component structure:
```json
{
  "my-component": {
    "title": "Some Great Title"
  }
}
```
