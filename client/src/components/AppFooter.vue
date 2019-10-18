<template>
    <v-footer app dark fixed padless>
        <v-card flat tile dense
                width="100%"
                class="blue-grey white--text text-center">
            <v-row justify="space-around" align="center">
                <div v-for="(link, i) in links" :key="i">
                    <a :href="link.href">
                        <v-col>
                            <img :src="link.img"
                                 alt="links"
                                 :height="imgHeight"/>
                        </v-col>
                    </a>
                </div>
            </v-row>
            <v-divider></v-divider>
            <div class="body-2 yellow--text text--accent-1 text-end px-3">{{ new Date().getFullYear() }}</div>
        </v-card>
    </v-footer>
</template>

<script>
  export default {
    name: "AppFooter",
    data() {
      return {
        links: [
          {
            href: 'https://vuejs.org/',
            img: 'https://camo.githubusercontent.com/728ce9f78c3139e76fa69925ad7cc502e32795d2/68747470733a2f2f7675656a732e6f72672f696d616765732f6c6f676f2e706e67'
          },
          {
            href: 'https://www.apollographql.com/',
            img: 'https://d33wubrfki0l68.cloudfront.net/714cc717dca2f94ab3db9b3260e9752acada13e0/93d35/static/logo-white-71d4c6230c1101080207f89be9f73925.png'
          },
          {
            href: 'https://expressjs.com/',
            img: 'http://sitev.ru/images/post/expressjs.png'
          },
          {
            href: 'https://mongoosejs.com/',
            img: 'https://mongoosejs.com/docs/images/mongoose5_62x30_transparent.png'
          }
        ]
      }
    },
    computed: {
      imgHeight: function () {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs':
          case 'sm':
            return 16;
          case 'md':
          case 'lg':
            return 32;
          default:
            return 48
        }
      }
    }
  }
</script>

<style scoped>

</style>
