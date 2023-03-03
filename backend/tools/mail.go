package tools

import (
	"net/mail"
	"net/smtp"

	"github.com/scorredoira/email"
)

type MailRequest struct {
	Name      string
	From     	string
	To       	string
	Teacher   string
	Password  string
	SmtpSrv  	string
	SmtpPort  string
}

func (m MailRequest) SendMail(title string, msg string, to string, cc []string) error {
	em := email.NewMessage(title, msg)
	em.From = mail.Address{Name: m.Name, Address: m.From}
	em.To = []string{to}
	em.Cc = cc
	auth := smtp.PlainAuth("", m.From, m.Password, m.SmtpSrv)
	err := email.Send(m.SmtpSrv+":"+m.SmtpPort, auth, em)
	return err
}

func (m MailRequest) SendMailWithFiles(title string, msg string, to string, cc []string, paths []string) error {
	em := email.NewMessage(title, msg)
	for _, path := range paths {
		if err := em.Attach(path); err != nil {
			return err
		}
	}
  em.From = mail.Address{Name: m.Name, Address: m.From}
	em.To = []string{to}
	em.Cc = cc
	auth := smtp.PlainAuth("", m.From, m.Password, m.SmtpSrv)
	err := email.Send(m.SmtpSrv+":"+m.SmtpPort, auth, em)
	return err
}