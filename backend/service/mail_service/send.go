package mailservice

import (
	"net/smtp"
)

type MailRequest struct {
	From     	string
	To       	string
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