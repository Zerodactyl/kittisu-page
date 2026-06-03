---
gitChangelog: false
---

# Manual Hooks Integration

::: info Notes
This document is modified from [KernelSU Official Documentation](https://kernelsu.org)
:::

If your kernel is not GKI or you prefer manual hook integration, you need to add KittiSU hooks to your kernel source manually.

## Choose a hook method {#choose-method}

KittiSU supports two hook methods: **KPROBES** and **Manual Hook**. KPROBES is the default and requires no additional setup. Manual hooks offer better performance and compatibility.

## Enable manual hooks in defconfig {#enable-manual-hooks}

Add the following to your device's defconfig:

```diff
+CONFIG_KSU=y
+CONFIG_KSU_MANUAL_HOOK=y
```

## Add manual hooks to kernel source {#add-hooks}

### For kernel versions 4.x+

Locate the `sys_call_table` declaration in your kernel source (usually in `arch/arm64/kernel/sys.c` or similar), and add the following code:

```c
#if defined(CONFIG_KSU_MANUAL_HOOK)
extern void ksu_arm64_syscall_hook(int nr, struct pt_regs *regs);
#define KSU_ARM64_SYSCALL_HOOK(nr, regs) ksu_arm64_syscall_hook(nr, regs)
#else
#define KSU_ARM64_SYSCALL_HOOK(nr, regs)
#endif
```

Then find the `sys_call_table` or the main syscall handler and add the hook:

```c
KSU_ARM64_SYSCALL_HOOK(nr, regs);
```

### Input hooks {#input-hooks}

For kernels that require `input` subsystem hooks (related to `MODULE_DEVICE_TABLE` compilation issues), add the following in your kernel's input subsystem code:

```c
#if defined(CONFIG_KSU_MANUAL_HOOK)
extern void ksu_handle_input_handle_event(unsigned int *type, unsigned int *code, int *value);
#endif
```

And call it in the input event handling path:

```c
ksu_handle_input_handle_event(&type, &code, &value);
```

## Verify integration {#verify}

After adding hooks, rebuild your kernel:

```sh
make -j$(nproc)
```

Flash the newly built kernel to your device. If KittiSU Manager detects root access, the integration was successful.
