import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginauthService } from './services/loginauth/loginauth.service';
import { TabsauthService } from './services/tabsauth/tabsauth.service';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),canActivate: [TabsauthService]
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'list',
    loadChildren: () => import('./list/list.module').then(m => m.ListPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule),canActivate: [LoginauthService]
  },
  {
    path: 'signup',
    loadChildren: () => import('./signup/signup.module').then( m => m.SignupPageModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule)
  },
  {
    path: 'my-profile',
    loadChildren: () => import('./my-profile/my-profile.module').then( m => m.MyProfilePageModule),canActivate: [TabsauthService]
  },
  {
    path: 'notifications',
    loadChildren: () => import('./notifications/notifications.module').then( m => m.NotificationsPageModule),canActivate: [TabsauthService]
  },
  {
    path: 'match-details/:id',
    loadChildren: () => import('./match-details/match-details.module').then( m => m.MatchDetailsPageModule),canActivate: [TabsauthService]
  },
  {
    path: 'matches-list',
    loadChildren: () => import('./matches-list/matches-list.module').then( m => m.MatchesListPageModule)
  },
  {
    path: 'owner-profile/:id',
    loadChildren: () => import('./owner-profile/owner-profile.module').then( m => m.OwnerProfilePageModule),canActivate: [TabsauthService]
  },
  {
    path: 'player-requests',
    loadChildren: () => import('./player-requests/player-requests.module').then( m => m.PlayerRequestsPageModule),canActivate: [TabsauthService]
  },
  {
    path: 'match-results',
    loadChildren: () => import('./match-results/match-results.module').then( m => m.MatchResultsPageModule),canActivate: [TabsauthService]
  },
  {
    path: 'favourite-properties',
    loadChildren: () => import('./favourite-properties/favourite-properties.module').then( m => m.FavouritePropertiesPageModule),canActivate: [TabsauthService]
  },
  {
    path: 'search-results',
    loadChildren: () => import('./search-results/search-results.module').then( m => m.SearchResultsPageModule),canActivate: [TabsauthService]
  },
  {
    path: 'transactions',
    loadChildren: () => import('./transactions/transactions.module').then( m => m.TransactionsPageModule)
  },
  {
    path: 'header',
    loadChildren: () => import('./header/header.module').then( m => m.HeaderPageModule)
  },
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then( m => m.TabsPageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then( m => m.SettingsPageModule)
  },
  {
    path: 'get-started',
    loadChildren: () => import('./get-started/get-started.module').then( m => m.GetStartedPageModule)
  },
  {
    path: 'upcoming-matchdetails',
    loadChildren: () => import('./upcoming-matchdetails/upcoming-matchdetails.module').then( m => m.UpcomingMatchdetailsPageModule),canActivate: [TabsauthService]
  },
  {
    path: 'previous-matchdetails',
    loadChildren: () => import('./previous-matchdetails/previous-matchdetails.module').then( m => m.PreviousMatchdetailsPageModule),canActivate: [TabsauthService]
  },
  {
    path: 'following',
    loadChildren: () => import('./following/following.module').then( m => m.FollowingPageModule),canActivate: [TabsauthService]
  },
  {
    path: 'otp/:email',
    loadChildren: () => import('./otp/otp.module').then( m => m.OtpPageModule)
  },
  {
    path: 'network-error',
    loadChildren: () => import('./network-error/network-error.module').then( m => m.NetworkErrorPageModule)
  },
  {
    path: 'payment',
    loadChildren: () => import('./payment/payment.module').then( m => m.PaymentPageModule)
  },
  {
    path: 'requestformatch/:owner_id',
    loadChildren: () => import('./requestformatch/requestformatch.module').then( m => m.RequestformatchPageModule)
  },
  {
    path: 'confirm-email',
    loadChildren: () => import('./confirm-email/confirm-email.module').then( m => m.ConfirmEmailPageModule)
  },
  {
    path: 'confirmations',
    loadChildren: () => import('./confirmations/confirmations.module').then( m => m.ConfirmationsPageModule)
  },
  {
    path: 'create-team',
    loadChildren: () => import('./create-team/create-team.module').then( m => m.CreateTeamPageModule)
  },
  {
    path: 'team-invitations',
    loadChildren: () => import('./team-invitations/team-invitations.module').then( m => m.TeamInvitationsPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
