export enum EDaoProfileTab {
  about = "About DAO",
  my_balance = "My Balance",
  validators = "Validators",
  delegations = "Delegation",
}

export const mapProfileTabToRoute = {
  [EDaoProfileTab.about]: "about",
  [EDaoProfileTab.my_balance]: "my-balance",
  [EDaoProfileTab.validators]: "validators",
  [EDaoProfileTab.delegations]: "delegations",
}

export const mapProfileTabToTitle = {
  [EDaoProfileTab.about]: "About DAO",
  [EDaoProfileTab.my_balance]: "My Balance",
  [EDaoProfileTab.validators]: "Validators",
  [EDaoProfileTab.delegations]: "Delegation",
}
