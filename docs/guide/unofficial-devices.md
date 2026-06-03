---

gitChangelog: false

---

# Unofficially supported devices / projects

::: warning
This page lists kernels/projects for GKI/non-GKI devices supporting KittiSU maintained by other developers.
:::

::: warning
This page is intended only to help you find the source code/project corresponding to your device. It **DOES NOT** mean that the source code/project has been reviewed by KittiSU developers. You should use it at your own risk.
:::

::: info
You can [submit an issue](https://github.com/terebiko/terebiko.github.io/issues) to the document repo to add devices you are maintaining.
:::

<script setup>
import data from '../repos.json'
</script>

<table>
   <thead>
      <tr>
         <th>Maintainer</th>
         <th>Repository</th>
         <th>Support devices</th>
      </tr>
   </thead>
   <tbody>
    <tr v-for="repo in data" :key="repo.devices">
        <td><a :href="repo.maintainer_link" target="_blank" rel="noreferrer">{{ repo.maintainer }}</a></td>
        <td><a :href="repo.kernel_link" target="_blank" rel="noreferrer">{{ repo.kernel_name }}</a></td>
        <td>{{ repo.devices }}</td>
    </tr>
   </tbody>
</table>
