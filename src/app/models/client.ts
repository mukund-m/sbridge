import { Module } from './module';

export class Client {
  _id?: any;
  slug: String;
  name: String;
  news: String;
  modulesCount: Number;
  usersCount: Number;
  leaderboardEnabled: Boolean = false;
  newsflashEnabled: Boolean = false;
  whatsNewEnabled: Boolean = false;
  theme = {
    colors: {
      primaryColor: '#2196F3',
      secondaryColor: '#1976D2',
      tertiaryColor: '#ECEFF1',
    },
    images: {
      defaultSquareLogo: 'https://marketing-image-production.s3.amazonaws.com/uploads/8759294174829f4d9d88e3d3ef000e4656444068a34d5bf5ab29f6f82b933729f4d9cbb0c183f386da1982dba7aca189b8acb4caf7ad5368bef99237b3da0af7.png',
      defaultLogo: 'https://marketing-image-production.s3.amazonaws.com/uploads/a81f91f420edce3466c1473b14fb9d32bcaf62b34176e2f61b05c3f22cc2b399e59e8ee492b48ebbe5cb210b3406c64f40f3882cabe6efd23d626d9436cc334f.png',
      defaultBackground: 'https://marketing-image-production.s3.amazonaws.com/uploads/20e336f3be2a78e7595695261e0e345cf56aa46b8a4f674a880d084065ebb7d747f46d2db718e4c08bfe57fd1489d092ef8219a7494040226fc7c52790b89cdd.jpg'
    }
  };
  content = {
    signupMessage: 'Welcome to Skillbridge. To continue using the service, kindly click the link below to activate your account.',
    invitationMessage: 'You have been invited to Skillbridge. To start using the service, sign in using the button below.',
    resetMessage: 'We\'ve received a request to reset your password. Kindly click the link below to complete the action. If you did not make this request, it is safe to disregard this message.',
  };

  constructor(client) {
    client._id ? this._id = client._id : this._id = 0;
    this.modulesCount = client.modulesCount || 0;
    this.usersCount = client.usersCount || 0;
    this.news = client.news || '';
    client.slug ? this.slug = client.slug : this.slug = '';
    client.leaderboardEnabled ? this.leaderboardEnabled = client.leaderboardEnabled : this.leaderboardEnabled = false;
    client.newsflashEnabled ? this.newsflashEnabled = client.newsflashEnabled : this.newsflashEnabled = false;
    client.whatsNewEnabled ? this.whatsNewEnabled = client.whatsNewEnabled : this.whatsNewEnabled = false;
    client.name ? this.name = client.name : this.name = 'Skill Bridge';
    if (client.theme) {
      if (client.theme.colors) {
        this.theme.colors.primaryColor = client.theme.colors.primaryColor || null;
        this.theme.colors.secondaryColor = client.theme.colors.secondaryColor || null;
        this.theme.colors.tertiaryColor = client.theme.colors.tertiaryColor || null;
      }
      if (client.theme.images) {
        this.theme.images.defaultSquareLogo = client.theme.images.defaultSquareLogo || null;
        this.theme.images.defaultLogo = client.theme.images.defaultLogo || null;
        this.theme.images.defaultBackground = client.theme.images.defaultBackground || null;
      }
    }
    if (client.content) {
      this.content.signupMessage = client.content.signupMessage || null;
      this.content.invitationMessage = client.content.invitationMessage || null;
      this.content.resetMessage = client.content.resetMessage || null;
    }
  }
}
