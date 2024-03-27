package auth

import "context"

func getService(ac Controller) Service {
	return Service{ac.MyDB, ac.SessionKey, ac.MailInfo, ac.SiteUrl, context.Background()}
}
