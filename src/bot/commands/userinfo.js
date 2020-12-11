const notablePermissions = [
    'kickMembers',
    'banMembers',
    'administrator',
    'manageChanneks',
    'manageGuilds',
    'manageMessages',
    'manageRoles',
    'manageEmojis',
    'manageWebhooks',
    'prioritySpeaker'
]

module.exports = {
    func: async message => {
      let member = message.member;
      if (message.mentions.length !== 0) member = message.channel.guild.members.get(message.mentions[0].id)
      const fields = []
      const perms = []
      Object.keys(member.permissions.json).forEach((perm) => {
        if (member.permissions.json[perm] === true && notablePermissions.indexOf(perm) !== -1) {
          perms.push(`\`${perm}\``)
        }
      })
      const roles = member.roles.map(r => message.channel.guild.roles.get(r)).sort((a,b)=>b.position-a.position);
      fields.push({
        name: 'Name',
        value: `**${member.username}#${member.discriminator}** ${member.nick ? `(**${member.nick}**)` : ''} (${member.id})`
      }, {
        name: 'Join Date',
        value: `**${new Date(member.joinedAt).toUTCString()}** (${Math.round((new Date().getTime() - member.joinedAt) / (1000 * 60 * 60 * 24))} days)`
      }, {
        name: 'Creation Date',
        value: `**${new Date(member.createdAt).toUTCString()}** (${Math.round((new Date().getTime() - member.createdAt) / (1000 * 60 * 60 * 24))} days)`
      }, {
        name: 'Roles',
        value: roles.length !== 0 ? roles.map(c => `\`${c.name}\``).join(", ") : 'None'
      }, {
        name: 'Notable Permissions',
        value: perms.length !== 0 ? perms.join(", ") : 'None'
      })
      message.channel.createMessage({
        embed: {
          timestamp: new Date(message.timestamp),
          color: roles[0].color,
          thumbnail: {
            url: member.avatar ? member.avatarURL : `https://cdn.discordapp.com/embed/avatars/${member.discriminator % 5}.png`
          },
          fields: fields
        }
      }).catch(() => { })
    },
    name: 'userinfo',
    description: 'Use this with a mention to get info about a user.', // The restriction of using a mention is very intentional.
    type: 'any',
    category: 'General'
  }
