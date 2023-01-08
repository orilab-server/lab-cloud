package mailservice

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

func (m MailRequest) Send(msg []byte) error {
	auth := smtp.PlainAuth("", m.From, m.Password, m.SmtpSrv)
	err := smtp.SendMail(m.SmtpSrv+":"+m.SmtpPort, auth, m.From, []string{m.To}, msg)
	if err != nil {
		return err
	}
	return nil
}

func (m MailRequest) SendOptional(msg []byte, to string) error {
	auth := smtp.PlainAuth("", m.From, m.Password, m.SmtpSrv)
	err := smtp.SendMail(m.SmtpSrv+":"+m.SmtpPort, auth, m.From, []string{to}, msg)
	if err != nil {
		return err
	}
	return nil
}

func (m MailRequest) SendWithCc(em *email.Message, to string, cc string) error {
  em.From = mail.Address{Name: m.Name, Address: m.From}
	em.To = []string{to}
	em.Cc = []string{cc}
	auth := smtp.PlainAuth("", m.From, m.Password, m.SmtpSrv)
	err := email.Send(m.SmtpSrv+":"+m.SmtpPort, auth, em)
	return err
}