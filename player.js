/*jshint esversion: 6, asi: true, laxbreak: true*/
const Player = pc.createScript("player");
Player.attributes.add("moveSpeed", { type: "number", default: 0.1 });
Player.attributes.add("rotateSpeed", { type: "number", default: 2 });

const move = (direction, entity, self) => {
  const { photon } = self;
  switch (direction) {
    case "up": {
      entity.translateLocal(0, 0, -self.moveSpeed);
      break;
    }
    case "down": {
      entity.translateLocal(0, 0, self.moveSpeed);
      break;
    }
    default: {
      break;
    }
  }
  // send position
  photon.raiseEvent(1, entity.getLocalPosition());
};

const rotate = (direction, entity, self) => {
  const { photon } = self;

  switch (direction) {
    case "left": {
      entity.rotate(0, -self.rotateSpeed, 0);
      break;
    }
    case "right": {
      entity.rotate(0, self.rotateSpeed, 0);
      break;
    }
    default: {
      break;
    }
  }
  // send rotation
  photon.raiseEvent(2, entity.getLocalRotation());
};

Player.prototype.initialize = function() {
  this.photon = this.app.root.children[0].photon;
  this.photon.setLogLevel(999);
  this.photon.onJoinRoom = () => {
    Object.values(this.photon.actors).map(event => {
      const { isLocal, actorNr } = event;
      if (isLocal) {
      } else {
        const entity = new pc.Entity();
        entity.addComponent("model", {
          type: "box"
        });
        entity.setPosition(2, 1, 0);
        entity.tags.add(`${actorNr}`);
        this.app.root.addChild(entity);
      }
    });
  };

  this.photon.onActorJoin = event => {
    const { isLocal, actorNr } = event;
    if (isLocal) {
    } else {
      const entity = new pc.Entity();
      entity.addComponent("model", {
        type: "box"
      });
      entity.setPosition(0, 1, 0);
      entity.tags.add(`${actorNr}`);
      this.app.root.addChild(entity);
    }
  };

  this.photon.onEvent = (code, content, actorNr) => {
    const entities = this.app.root.findByTag(`${actorNr}`);
    const [entity] = entities;

    switch (code) {
      case 1: {
        const { x, y, z } = content;
        entity.setLocalPosition(x, y, z);
        break;
      }
      case 2: {
        const { x, y, z, w } = content;
        console.log(content);
        entity.setLocalRotation(x, y, z, w);
        break;
      }
      default: {
        break;
      }
    }
  };
};

// update code called every frame
Player.prototype.update = function(dt) {
  const { keyboard } = this.app;

  if (keyboard.isPressed(pc.KEY_W) || keyboard.isPressed(pc.KEY_UP)) {
    move("up", this.entity, this);
  } else if (keyboard.isPressed(pc.KEY_S) || keyboard.isPressed(pc.KEY_DOWN)) {
    move("down", this.entity, this);
  }

  if (keyboard.isPressed(pc.KEY_A) || keyboard.isPressed(pc.KEY_LEFT)) {
    rotate("right", this.entity, this);
  } else if (keyboard.isPressed(pc.KEY_D) || keyboard.isPressed(pc.KEY_RIGHT)) {
    rotate("left", this.entity, this);
  }
};
