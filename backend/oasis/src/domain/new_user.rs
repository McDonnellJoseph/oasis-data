use crate::domain::{UserEmail, UserName};

pub struct NewUser {
    pub email: UserEmail,
    pub name: UserName,
    pub surname: UserName,
}
