---
gitChangelog: false
---

# Installing KittiSU {#install}

::: tip
We assume you already have basic firmware flashing skills and bricking recovery knowledge, so this section of the documentation will not be overly detailed.
:::

## Get Manager {#get-manager}

::: tip Work in Progress...
KittiSU's manager is currently under development. You can obtain the latest build via [`GitHub Actions`](https://github.com/terebiko/KittiSU/actions/workflows/build-manager.yml).

(Nightly.link allows downloading files without logging into a GitHub account.)
:::

## Install {#installation}

KittiSU provides the following installation method:

### GKI2/GKI1/Non-GKI Kernel (AnyKernel3) Installation {#builtin}

Although the KittiSU Manager has a built-in AnyKernel3 installation method, this option will not be displayed if the Manager does not have ROOT access. You may need to perform the following steps to enable it:

1. Flash AnyKernel3 to grant root.
2. Using `magiskboot` to manually patch boot.img.

#### Patch boot.img manually {#manual-patch-boot}

::: info Note
This part is picked from [KernelSU Official Documentation](https://kernelsu.org)
:::

1. [magiskboot](https://github.com/topjohnwu/Magisk/releases)
2. [magiskboot_build](https://github.com/ookiineko/magiskboot_build/releases/tag/last-ci)

The official build of `magiskboot` can only run on Android devices; if you want to run it on PC, you can try the second option.

##### Preparation

1. Get your device's stock boot.img. You can get it from your device manufacturers. You may need [payload-dumper-go](https://github.com/ssut/payload-dumper-go).
2. Unpack the AnyKernel3 package and get the `Image` file, which is the kernel file of KernelSU.

##### Using magiskboot on Android devices {#using-magiskboot-on-android-devices}

1. Download the latest Magisk from [GitHub Releases](https://github.com/topjohnwu/Magisk/releases).
2. Rename `Magisk-*(version).apk` to `Magisk-*.zip` and unzip it.
3. Push `Magisk-*/lib/arm64-v8a/libmagiskboot.so` to your device by ADB: `adb push Magisk-*/lib/arm64-v8a/libmagiskboot.so /data/local/tmp/magiskboot`
4. Push stock boot.img and Image from AnyKernel3 to your device.
5. Enter ADB shell and run `cd /data/local/tmp/`, then `chmod +x magiskboot`
6. Execute `./magiskboot unpack boot.img` to unpack `boot.img`, you will get a `kernel` file — this is your stock kernel.
7. Replace `kernel` with `Image`: `mv -f Image kernel`
8. Execute `./magiskboot repack boot.img` to repack the boot image, you will get a `new-boot.img` file — flash this to device by fastboot.

##### Using magiskboot on Windows/macOS/Linux PC {#using-magiskboot-on-pc}

1. Download the corresponding `magiskboot` binary for your OS from [magiskboot_build](https://github.com/ookiineko/magiskboot_build/releases/tag/last-ci).
2. Prepare stock `boot.img` and `Image` on your PC.
3. Run `chmod +x magiskboot`.
4. Execute `./magiskboot unpack boot.img` to unpack `boot.img`, you will get a `kernel` file — this is your stock kernel.
5. Replace `kernel` with `Image`: `mv -f Image kernel`
6. Execute `./magiskboot repack boot.img` to repack the boot image, you will get a `new-boot.img` file — flash this to device by fastboot.

::: info
Official `magiskboot` can run normally in Linux environments. If you're a Linux user, you can use the official build.
:::
