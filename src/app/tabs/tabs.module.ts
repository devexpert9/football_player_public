import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children:[
      {
        path: 'home', 
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../home/home.module').then(m => m.HomePageModule)  
          }
        ]
      },
      {
        path: 'matches-list',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../matches-list/matches-list.module').then(m => m.MatchesListPageModule)
          }
        ]
      },
      {
        path: 'my-profile',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../my-profile/my-profile.module').then(m => m.MyProfilePageModule)
          }
        ]
      },      
        {
          path: 'favourite-properties',
          children: [
            {
              path: '',
              loadChildren: () =>
                import('../favourite-properties/favourite-properties.module').then(m => m.FavouritePropertiesPageModule)
            }
          ]
        },
        { path: 'notifications', loadChildren: '../notifications/notifications.module#NotificationsPageModule' },
        {
          path: 'settings',
          children: [
            {
              path: '',
              loadChildren: () =>
                import('../settings/settings.module').then(m => m.SettingsPageModule)
            }
          ]
        },
        // { path: 'settings', loadChildren: '../settings/settings.module#SettingsPageModule' },
        // { path: 'my-profile', loadChildren: '../my-profile/my-profile.module#MyProfilePageModule' },
        { path: 'transactions', loadChildren: '../transactions/transactions.module#TransactionsPageModule' },
        { path: 'match-details', loadChildren: '../match-details/match-details.module#MatchDetailsPageModule' },
        { path: 'match-results', loadChildren: '../match-results/match-results.module#MatchResultsPageModule' },
        { path: 'owner-profile', loadChildren: '../owner-profile/owner-profile.module#OwnerProfilePageModule' },
        { path: 'search-results', loadChildren: '../search-results/search-results.module#SearchRresultsPageModule' },
        { path: 'following', loadChildren: '../following/following.module#FollowingPageModule' },
    ]
  },
  {
    path:'',
    redirectTo:'/tabs/',
    pathMatch:'full'
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {}
