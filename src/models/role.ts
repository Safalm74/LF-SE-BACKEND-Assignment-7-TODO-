import BaseModel from "./base";

export class RoleModel extends BaseModel {
  static async getPermissionForRole(role_id: string) {
    const query = this.queryBuilder()
      .join(
        "permissions",
        "permissions.id",
        "roles_and_permissions.permission_id"
      )
      .select("permissions.permissions")
      .table("roles_and_permissions")
      .where({ role_id: role_id });

    return query;
  }
}
// const posts = await db('posts')
//   .join('users', 'users.id', 'posts.user_id')
//   .select('posts.id', 'users.username', 'posts.contents')
//   .where({user_id: id})
