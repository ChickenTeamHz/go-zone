export const menuData = [{
  link: '/',
  desc: 'Home',
},{
  link: '/blog',
  desc: 'My Blog',
  children: [{
    link: '/blog/posts',
    desc: 'My Column',
  },{
    link: '/blog/likes',
    desc: 'Like',
  },{
    link: '/blog/draft',
    desc: 'Draft',
  }],
},{
  link: '/album',
  desc: 'My Album',
},{
  link: '/profile',
  desc: 'Profile',
},{
  link: '/user/login',
  desc: 'Sign Out',
}]
