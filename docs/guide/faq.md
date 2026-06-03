---
gitChangelog: false
---

# FAQ

## Compilation error when invoking the  `MODULE_DEVICE_TABLE`  macro {#MODULE-DEVICE-TABLE}

The error occurs because the `input handler` **in the kernel source code** is corrupted, which prevents the parameter type verification and syntax parsing from executing normally during macro invocation.

Please add the corresponding calls to the kernel source code according to [the document](manual-integrate.md#input-hooks)

## Module not working  {#MODULE-NOT-WORKING}

::: info Notes
This part is only answered for modules which require sepolicy changes. Like LSPosed/ZygiskNext module will have this problem.
:::

Due to the refactoring of the sepolicy part following the upstream KernelSU, modules may not work if either the kernel or the manager is outdated. Please upgrade both to the latest versions.