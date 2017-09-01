Personal Goals CLI
==================
Inspired by [Una Kravets](http://una.im/personal-goals-guide)  
Simple way to create and manage weekly/monthly/yearly/other goals

To use: `yarn global add personal-goals-cli`  
make sure to set the active directory and where to store your README!

`goals cfg dir '/users/me/projects/personal-goals/goals'`

`goals cfg readme '/users/me/projects/personal-goals/'`

They can be the same, I just like the goals contained in their own folder 😀


# Examples: 

All commands will start with `goals`

## Creating a new goal

You can use `new` or `n` to create a new goal followed by the type (`yearly` or `y`, `monthly` or `m`, `weekly` or `w`, `other` or `o`).  

The default is `weekly`
```
goals new w 'track my personal goals'                     #creates a new weekly goal
goals n other 'contribute to 3 open source projects'      #creates a new 'other' goal
goals n y 'survive another year'                          #creates a new yearly goal
```

## Marking a goal as completed

You can use `complete` or `c` to mark a goal as completed followed by the type (`yearly` or `y`, `monthly` or `m`, `weekly` or `w`, `other` or `o`).  

The default is `weekly`
```
goals complete w      #will list all weekly goals and allow you to choose which to mark as completed
goals c               #will list all weekly goals and allow you to choose which to mark as completed
goals c y             #will list all yearly goals and allow you to choose which to mark as completed
```

## Listing Goals

You can use `ls` or `list` to list goals followed by the type (`yearly` or `y`, `monthly` or `m`, `weekly` or `w`, `other` or `o`, `completed` or `c`, or `all` or `a`).  

The default is `all`
```
goals ls             #lists all goals
goals list           #lists all goals
goals ls c           #lists all completed goals
goals list y         #lists all yearly goals
goals ls weekly      #lists all weekly goals
```

## Changing Config

You can use `config` or `cfg` to manage the configuration settings

Possible configuration keys are `dir`, `readme`, `weeklyfocus`, `monthlyfocus`, `yearlyfocus`

The `dir` is where your goals reside and `readme` is where you want the README.md to be generated

```
goals cfg dir '/users/me/projects/personal-goals/goals'
goals cfg readme '/users/me/projects/personal-goals/'
goals config weeklyfocus 'getting enough sleep'
goals config monthlyfocus 'getting more involved in communities'
goals cfg yearlyfocus 'surviving the nazi-pocalypse'
goals config clear                      #will clear all config settings
goals config clear weeklyfocus          #will delete the weeklyfocus
goals config ls                         #will list the current config settings
```

## Clearing Goals 

You can use `clear` or `clr` to create a new goal followed by the type (`yearly` or `y`, `monthly` or `m`, `weekly` or `w`, `other` or `o`, `completed` or `c`, or `all` or `a`).  

The default is `all`
```
goals clr                  #deletes all goals
goals clear weekly         #deletes all weekly goals
goals clr c                #deletes all completed goals
```

### README:
The generated README will be in the following format

Personal Goals
==============
Personal goals made open source for accessibility across computers I use, transparency, accountability, and versioning. Learn more about it [here](http://una.im/personal-goals-guide).

# Overarching Goals for 2017:
### This year's focus: Do good things this year

  

  
# Weekly Goals Aug 27th, 2017:
### This week's focus: Do good things this week



# Monthly Goals August 2017:
### This month's focus: Do good things this month

  

# Other Goals:

