# Cockpit UPower

A simple module that displays output from UPower (battery usage, levels, etc.)

# Installing from distribution

- Install upower
- Download latest cockpit-upower release
- Extract the content of dist folder to /usr/share/cockpit/upower
- Refresh cockpit page (hard refresh might needed Ctrl+Shift+R)


```bash
wget https://github.com/mitsakosgr/cockpit-upower/releases/latest/download/cockpit-upower.tar.xz && \
  tar -xf cockpit-upower.tar.xz cockpit-upower/dist && \
  sudo mv cockpit-upower/dist /usr/share/cockpit/upower && \
  rm -r cockpit-upower && \
  rm cockpit-upower.tar.xz
```
_Installation script provided by [@subz390](https://github.com/subz390) for [cockpit-sensors](https://github.com/ocristopfer/cockpit-sensors/issues/2)_


# Installing from sources

Packages `gettext`, `nodejs` `npm` and `make` are required.

On Debian/Ubuntu:

    $ sudo apt install gettext nodejs npm make

On Fedora:

    $ sudo dnf install gettext nodejs npm make

```
git clone https://github.com/mitsakosgr/cockpit-upower.git
cd cockpit-upower
sudo make install
```

# Module created using Cockpit Starter Kit
    
[Starter Kit](https://github.com/cockpit-project/starter-kit)